# STWIK2124-arl-01

# Accessible Reading List (ARL)

An Accessible Reading List (ARL) is a full-stack web application developed as part of Assignment 3. The project enables users to manage a collection of books through a modern Angular frontend and a Spring Boot REST API backend.

The application demonstrates full-stack web development concepts including RESTful APIs, client-server communication, authentication, validation, testing, and production deployment.

---

## Project Structure

```
book-website/
│
├── backend/          # Spring Boot REST API
│   └── README.md
│
├── frontend/         # Angular Application
│   └── README.md
│
└── README.md         # Project overview
```

---

## Features

- View books with pagination
- Search books by keyword
- View book details
- Create new books
- Update existing books
- Delete books
- Client-side form validation
- Server-side validation
- Basic Authentication (Spring Security)
- RESTful API
- Responsive Angular frontend

---

## Technology Stack

### Backend

- Java 17
- Spring Boot 4
- Spring MVC
- Spring Data JPA
- Spring Security (Basic Authentication)
- MySQL
- Maven
- JUnit 5

### Frontend

- Angular 17
- TypeScript
- RxJS
- Angular HttpClient

---

## Repository Structure

Each application has its own documentation:

| Module | Description |
|---------|-------------|
| `/backend` | Spring Boot REST API |
| `/frontend` | Angular Client |

Please refer to the README file inside each folder for installation instructions and implementation details.

---

## Getting Started

Clone the repository:

```
git clone https://github.com/Rashad-Sheva/STIWK2124-arl-A1-01.git
```

Navigate into the project:

```
cd STIWK2124-arl-A1-01
```

Then follow the setup guide in:

- `backend/README.md`
- `frontend/README.md`

---

## Project Highlights

This project demonstrates:

- Full-stack web development
- RESTful API design
- CRUD operations
- Pagination and searching
- Form validation
- Exception handling
- Authentication and authorization
- Unit testing
- Production build generation

---

## Testing

Backend tests were implemented using **JUnit 5**, while the frontend includes Angular unit test files.

Example backend test execution:

```bash
cd backend
mvn clean test
```

Frontend production build:

```bash
cd frontend
npm install
npm run build
```
