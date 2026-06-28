// Matches the Book entity returned by the Spring Boot backend
export interface Book {
  id:          number;
  title:       string;
  author:      string;
  category:    string;
  description: string;
}

// Payload for POST / PUT requests
export interface BookRequest {
  title:       string;
  author:      string;
  category:    string;
  description: string;
}

// Spring's Page<T> response shape (returned directly by the backend)
export interface PageResponse<T> {
  content:          T[];
  totalElements:    number;
  totalPages:       number;
  size:             number;
  number:           number;   // current page index (zero-based)
  first:            boolean;
  last:             boolean;
  numberOfElements: number;
  empty:            boolean;
}
