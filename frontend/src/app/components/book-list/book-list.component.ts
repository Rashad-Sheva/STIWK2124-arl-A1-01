import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BookService } from '../../services/book.service';
import { Book, PageResponse } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit, OnDestroy {

  books:          Book[]             = [];
  pageData:       PageResponse<Book> | null = null;
  loading         = false;
  errorMessage    = '';
  successMessage  = '';

  searchKeyword   = '';
  currentPage     = 0;
  pageSize        = 5;
  speaking        = false;

  private search$ = new Subject<string>();
  private destroy$= new Subject<void>();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();

    // Debounce: wait 400ms after user stops typing before searching
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(kw => {
      this.currentPage    = 0;
      this.searchKeyword  = kw;
      this.loadBooks();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.speechSynthesis?.cancel();
  }

  loadBooks(): void {
    this.loading      = true;
    this.errorMessage = '';

    this.bookService.getBooks(this.searchKeyword, this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: page => {
          this.books    = page.content;
          this.pageData = page;
          this.loading  = false;
        },
        error: err => {
          this.errorMessage = err.message;
          this.loading      = false;
        }
      });
  }

  onSearchInput(value: string): void {
    this.search$.next(value);
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.currentPage   = 0;
    this.loadBooks();
  }

  goToPage(page: number): void {
    if (!this.pageData) return;
    if (page < 0 || page >= this.pageData.totalPages) return;
    this.currentPage = page;
    this.loadBooks();
  }

  deleteBook(id: number, title: string): void {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    this.bookService.deleteBook(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = `"${title}" was deleted.`;
          setTimeout(() => this.successMessage = '', 3000);
          // If last item on page, go back one page
          if (this.books.length === 1 && this.currentPage > 0) {
            this.currentPage--;
          }
          this.loadBooks();
        },
        error: err => { this.errorMessage = err.message; }
      });
  }

  // ── Read Aloud — Web Speech API ──────────────────────────

  readAloud(book: Book): void {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }
    window.speechSynthesis.cancel();

    const text = `Title: ${book.title}. Author: ${book.author}. `
               + `Category: ${book.category}. ${book.description ?? ''}`;

    const utterance   = new SpeechSynthesisUtterance(text);
    utterance.lang    = 'en-US';
    utterance.rate    = 0.9;
    utterance.onstart = () => this.speaking = true;
    utterance.onend   = () => this.speaking = false;
    utterance.onerror = () => this.speaking = false;

    window.speechSynthesis.speak(utterance);
  }

  stopReading(): void {
    window.speechSynthesis?.cancel();
    this.speaking = false;
  }

  get pageNumbers(): number[] {
    if (!this.pageData) return [];
    return Array.from({ length: this.pageData.totalPages }, (_, i) => i);
  }
}
