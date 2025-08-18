package aivle0514.backspringboot.question;

import aivle0514.backspringboot.question.QuestionAnswerDto;
import lombok.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuestionAnswerController {

    private final QuestionAnswerService service;

    @GetMapping("/api/questions/{questionId}/answers")
    public List<QuestionAnswerDto.Response> list(@PathVariable Long questionId) {
        return service.listByQuestion(questionId).stream().map(QuestionAnswerDto.Response::from).toList();
    }

    @PostMapping("/api/questions/{questionId}/answers")
    public QuestionAnswerDto.Response create(@PathVariable Long questionId, @Valid @RequestBody QuestionAnswerDto.CreateRequest req) {
        // path param 우선
        req.setQuestionId(questionId);
        return QuestionAnswerDto.Response.from(service.create(req));
    }

    @DeleteMapping("/api/question-answers/{answerId}")
    public void delete(@PathVariable Long answerId, @RequestParam String author) {
        service.delete(answerId, author);
    }
}
