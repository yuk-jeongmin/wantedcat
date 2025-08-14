package aivle0514.backspringboot.post;

import aivle0514.backspringboot.user.User;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // 목록/검색/필터
    Page<Post> findAllByCategoryOrderByCreatedAtDesc(String category, Pageable pageable);
    Page<Post> findAllByTitleContainingOrContentContaining(String t, String c, Pageable pageable);

    // 사용자 기준
    List<Post> findAllByUser(User user);
    List<Post> findAllByUser_Id(Long userId);
    Optional<Post> findByIdAndUser_Id(Long id, Long userId);
}
