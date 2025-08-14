package aivle0514.backspringboot.notice;

import aivle0514.backspringboot.user.User;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Page<Notice> findAllByOrderByIsPinnedDescCreatedAtDesc(Pageable pageable);
    Page<Notice> findAllByCategoryOrderByIsPinnedDescCreatedAtDesc(String category, Pageable pageable);

    List<Notice> findAllByUser(User user);
    List<Notice> findAllByUser_Id(Long userId);
    Optional<Notice> findByIdAndUser_Id(Long id, Long userId);
}
