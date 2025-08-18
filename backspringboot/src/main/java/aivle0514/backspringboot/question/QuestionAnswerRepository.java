package aivle0514.backspringboot.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Long> {
    List<QuestionAnswer> findAllByQuestion_Id(Long questionId);
    Optional<QuestionAnswer> findByIdAndAuthor(Long id, String author);
}
