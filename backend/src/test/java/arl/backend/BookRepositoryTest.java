package arl.backend;

import arl.backend.model.Book;
import arl.backend.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BookRepositoryTest {

    @Autowired
    private BookRepository repository;

    @Test
    void saveBookSuccess() {

        Book book = new Book();
        book.setTitle("JUnit Test");
        book.setAuthor("Julius");

        Book saved = repository.save(book);

        assertNotNull(saved.getId());
    }

    @Test
    void findBookSuccess() {

        Book book = new Book();
        book.setTitle("Find Test");
        book.setAuthor("Julius");

        Book saved = repository.save(book);

        Optional<Book> result =
                repository.findById(saved.getId());

        assertTrue(result.isPresent());
    }

    @Test
    void findBookFailure() {

        Optional<Book> result =
                repository.findById(999999L);

        assertFalse(result.isPresent());
    }

    @Test
    void deleteBookSuccess() {

        Book book = new Book();
        book.setTitle("Delete Test");
        book.setAuthor("Julius");

        Book saved = repository.save(book);

        repository.deleteById(saved.getId());

        Optional<Book> result =
                repository.findById(saved.getId());

        assertFalse(result.isPresent());
    }
}