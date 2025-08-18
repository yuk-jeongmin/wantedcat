package aivle0514.backspringboot.post;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByCategoryOrderByCreatedAtDesc(String category, Pageable pageable);
    Page<Post> findAllByTitleContainingOrContentContaining(String t, String c, Pageable pageable);

    List<Post> findAllByAuthor(String author);
    Optional<Post> findByIdAndAuthor(Long id, String author);
}
