package arl.backend.controller;

import arl.backend.model.Book;
import arl.backend.repository.BookRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Book CRUD.
 *
 * NOTE: CORS is now handled centrally by SecurityConfig.
 * The @CrossOrigin annotation is removed to avoid conflicts
 * with Spring Security's CORS filter.
 */
@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookRepository repository;

    // CREATE — requires Basic Auth (enforced by SecurityConfig)
    @PostMapping
    public ResponseEntity<Book> create(@Valid @RequestBody Book book) {
        Book saved = repository.save(book);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // READ ALL — public, supports pagination + search
    @GetMapping
    public Page<Book> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        if (q != null && !q.trim().isEmpty()) {
            String search = q.trim();
            return repository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
                    search, search, pageable);
        }
        return repository.findAll(pageable);
    }

    // READ ONE — public
    @GetMapping("/{id}")
    public ResponseEntity<Book> getOne(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE — requires Basic Auth (enforced by SecurityConfig)
    @PutMapping("/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @Valid @RequestBody Book book) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        book.setId(id);
        return ResponseEntity.ok(repository.save(book));
    }

    // DELETE — requires Basic Auth (enforced by SecurityConfig)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
