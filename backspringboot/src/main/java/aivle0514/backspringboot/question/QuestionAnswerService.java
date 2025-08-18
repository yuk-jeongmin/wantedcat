package aivle0514.backspringboot.question;

import aivle0514.backspringboot.question.QuestionAnswerDto;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionAnswerService {

    private final QuestionAnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public List<QuestionAnswer> listByQuestion(Long questionId) {
        return answerRepository.findAllByQuestion_Id(questionId);
    }

    @Transactional
    public QuestionAnswer create(QuestionAnswerDto.CreateRequest req) {
        Question q = questionRepository.findById(req.getQuestionId()).orElseThrow();
        QuestionAnswer a = new QuestionAnswer();
        a.setQuestion(q);
        a.setContent(req.getContent());
        a.setAuthor(req.getAuthor());
        return answerRepository.save(a);
    }

    @Transactional
    public void delete(Long answerId, String author) {
        QuestionAnswer a = answerRepository.findByIdAndAuthor(answerId, author).orElseThrow();
        answerRepository.delete(a);
    }
}
