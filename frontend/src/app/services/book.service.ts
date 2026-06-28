import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Book, BookRequest, PageResponse } from '../models/book.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {

  private readonly API     = `${environment.apiUrl}/books`;
  private readonly TIMEOUT = 10000; // 10 second timeout

  constructor(private http: HttpClient) {}

  /**
   * GET /api/books
   * Returns Spring Page<Book> directly (no wrapper).
   * Supports ?q= search and ?page= ?size= pagination.
   */
  getBooks(keyword = '', page = 0, size = 5): Observable<PageResponse<Book>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (keyword.trim()) {
      params = params.set('q', keyword.trim());
    }

    return this.http
      .get<PageResponse<Book>>(this.API, { params })
      .pipe(timeout(this.TIMEOUT), catchError(this.handleError));
  }

  /**
   * GET /api/books/:id → Book or 404
   */
  getBookById(id: number): Observable<Book> {
    return this.http
      .get<Book>(`${this.API}/${id}`)
      .pipe(timeout(this.TIMEOUT), catchError(this.handleError));
  }

  /**
   * POST /api/books → 201 Created, returns saved Book
   * Auth header added automatically by authInterceptor
   */
  createBook(book: BookRequest): Observable<Book> {
    return this.http
      .post<Book>(this.API, book)
      .pipe(timeout(this.TIMEOUT), catchError(this.handleError));
  }

  /**
   * PUT /api/books/:id → 200 OK, returns updated Book
   * Auth header added automatically by authInterceptor
   */
  updateBook(id: number, book: BookRequest): Observable<Book> {
    return this.http
      .put<Book>(`${this.API}/${id}`, book)
      .pipe(timeout(this.TIMEOUT), catchError(this.handleError));
  }

  /**
   * DELETE /api/books/:id → 204 No Content
   * Auth header added automatically by authInterceptor
   */
  deleteBook(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API}/${id}`)
      .pipe(timeout(this.TIMEOUT), catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let message = 'An unexpected error occurred.';

    if (error.name === 'TimeoutError') {
      message = 'Request timed out. Is the Spring Boot backend running?';
    } else if (error.status === 0) {
      message = 'Cannot reach the server. Make sure Spring Boot is running on port 8080.';
    } else if (error.status === 400) {
      const errs = error.error;
      if (typeof errs === 'object' && errs !== null) {
        message = Object.values(errs).join(' | ');
      } else {
        message = 'Validation error. Please check your input.';
      }
    } else if (error.status === 401) {
      message = 'Unauthorized. Invalid credentials.';
    } else if (error.status === 404) {
      message = 'Book not found.';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(message));
  }
}
