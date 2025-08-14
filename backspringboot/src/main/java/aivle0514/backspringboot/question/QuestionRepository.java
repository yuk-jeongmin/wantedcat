package aivle0514.backspringboot.question;

import aivle0514.backspringboot.user.User;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Page<Question> findAllByStatusOrderByCreatedAtDesc(Question.Status status, Pageable pageable);
    Page<Question> findAllByCategoryAndStatus(String category, Question.Status status, Pageable pageable);

    List<Question> findAllByUser(User user);
    List<Question> findAllByUser_Id(Long userId);
    Optional<Question> findByIdAndUser_Id(Long id, Long userId);
}
