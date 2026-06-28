# Accessible Reading List — Frontend

**Stack:** Angular 17 · TypeScript · HttpClient · Reactive Forms

---

## Team Members
- Rashad-Sheva
- ainfana01
- ainasafa
- Mel0205

---

## Features

- **Book List** — paginated display of all books (5 per page)
- **Search** — real-time search by title or author (debounced 400ms)
- **Add Book** — form with full client-side validation
- **Edit Book** — pre-filled form for updating a book
- **Delete Book** — confirmation prompt before deleting
- **Read Aloud** — Web Speech API text-to-speech on every book card
- **Basic Auth** — automatically attached to POST / PUT / DELETE requests
- **Error Handling** — timeout detection, connection errors, server errors

---

## Prerequisites

| Tool        | Version  |
|-------------|----------|
| Node.js     | 18+      |
| npm         | 9+       |
| Angular CLI | 17+      |
| Spring Boot backend | running on port 8080 |

---

## Project Structure

```
src/app/
├── models/
│   └── book.model.ts          # Book, BookRequest, PageResponse interfaces
├── services/
│   ├── book.service.ts        # All HTTP calls to /api/books
│   └── auth.service.ts        # Basic Auth header generator
├── interceptors/
│   └── auth.interceptor.ts    # Auto-attaches auth to POST/PUT/DELETE
└── components/
    ├── navbar/                # Top navigation bar
    ├── book-list/             # List + search + pagination + delete + read aloud
    └── book-form/             # Create / Edit form with validation
```

## Setup Frontend

### 1. Install Angular CLI globally
```bash
npm install -g @angular/cli
```

### 2. Clone the repository
```bash
git clone https://github.com/Rashad-Sheva/STIWK2124-arl-A1-01.git
cd STIWK2124-arl-A1-01
```

### 3. Install dependencies
```bash
cd frontend
npm install
```

### 4. Make sure the backend is running
Start your Spring Boot backend first:
```bash
# In the backend project folder
cd backend
mvn spring-boot:run
```
The backend must be running at `http://localhost:8080`.

### 5. Start the Angular app
```bash
npm start
```

Open your browser at **http://localhost:4200**

### 6. Start the Test Angular
```bash
npm run build
```

---


