import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit, OnDestroy {

  // form is initialized in the CONSTRUCTOR (not ngOnInit)
  // so it is always defined when Angular first renders the template
  form: FormGroup;

  isEditMode     = false;
  bookId:        number | null = null;
  loading        = false;
  submitting     = false;
  errorMessage   = '';
  successMessage = '';

  private destroy$     = new Subject<void>();
  private loadingTimer: any;

  readonly categories = [
    'Programming', 'Framework', 'Architecture', 'Web',
    'Database', 'DevOps', 'Self-Help', 'Science',
    'Coming-of-Age', 'Literature', 'History', 'Mathematics', 'Other'
  ];

  constructor(
    private fb:     FormBuilder,
    private svc:    BookService,
    private route:  ActivatedRoute,
    private router: Router,
    private cdr:    ChangeDetectorRef
  ) {
    // Build the form HERE in the constructor so it exists
    // before Angular renders the template for the first time.
    // If we built it in ngOnInit, [formGroup]="form" would crash
    // on the first render cycle when navigating via the router.
    this.form = this.fb.group({
      title:       ['', [Validators.required, Validators.maxLength(255)]],
      author:      ['', [Validators.required, Validators.maxLength(255)]],
      category:    ['', [Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId     = +id;
      this.loadBook(this.bookId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.loadingTimer);
  }

  loadBook(id: number): void {
    this.loading      = true;
    this.errorMessage = '';

    // Force re-render immediately so the loading spinner appears
    // right away when navigating via Angular router
    this.cdr.detectChanges();

    // Safety timeout — resets loading if backend is unreachable
    clearTimeout(this.loadingTimer);
    this.loadingTimer = setTimeout(() => {
      if (this.loading) {
        this.loading      = false;
        this.errorMessage = 'Cannot reach the server. Make sure Spring Boot is running on port 8080.';
        this.cdr.detectChanges();
      }
    }, 12000);

    this.svc.getBookById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: book => {
          clearTimeout(this.loadingTimer);
          this.form.patchValue(book);
          this.loading = false;
          this.cdr.detectChanges();   // show the populated form
        },
        error: err => {
          clearTimeout(this.loadingTimer);
          this.errorMessage = err.message;
          this.loading      = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.submitting   = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const payload  = this.form.value;
    const request$ = this.isEditMode && this.bookId
      ? this.svc.updateBook(this.bookId, payload)
      : this.svc.createBook(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.successMessage = this.isEditMode
          ? 'Book updated successfully!'
          : 'Book created successfully!';
        this.submitting = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/books']), 1200);
      },
      error: err => {
        this.errorMessage = err.message;
        this.submitting   = false;
        this.cdr.detectChanges();
      }
    });
  }

  get title()       { return this.form.get('title')!;       }
  get author()      { return this.form.get('author')!;      }
  get category()    { return this.form.get('category')!;    }
  get description() { return this.form.get('description')!; }

  isInvalid(field: string): boolean {
    const c = this.form.get(field)!;
    return c.invalid && (c.dirty || c.touched);
  }
}
