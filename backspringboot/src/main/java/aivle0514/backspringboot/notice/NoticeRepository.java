package aivle0514.backspringboot.notice;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Page<Notice> findAllByOrderByIsPinnedDescCreatedAtDesc(Pageable pageable);
    Page<Notice> findAllByCategoryOrderByIsPinnedDescCreatedAtDesc(String category, Pageable pageable);

    List<Notice> findAllByAuthor(String author);
    Optional<Notice> findByIdAndAuthor(Long id, String author);
}
