package aivle0514.backspringboot.question;

import aivle0514.backspringboot.question.dto.QuestionDto;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService service;

    @GetMapping
    public Page<QuestionDto.Response> list(@RequestParam(defaultValue="0") int page,
                                           @RequestParam(defaultValue="10") int size,
                                           @RequestParam(required=false) String category,
                                           @RequestParam(required=false) String status) {
        Question.Status st = (status!=null && !status.isBlank()) ? Question.Status.valueOf(status) : null;
        return service.list(page, size, category, st).map(QuestionDto.Response::from);
    }

    @GetMapping("/{id}")
    public QuestionDto.Response get(@PathVariable Long id) {
        return QuestionDto.Response.from(service.get(id));
    }

    @PostMapping
    public QuestionDto.Response create(@Valid @RequestBody QuestionDto.CreateRequest req) {
        Question.Status st = req.getStatus()!=null ? Question.Status.valueOf(req.getStatus()) : null;
        return QuestionDto.Response.from(
            service.create(req.getTitle(), req.getContent(), req.getUserId(), req.getCategory(), st)
        );
    }

    @PutMapping("/{id}")
    public QuestionDto.Response update(@PathVariable Long id, @Valid @RequestBody QuestionDto.UpdateRequest req) {
        Question.Status st = req.getStatus()!=null ? Question.Status.valueOf(req.getStatus()) : null;
        return QuestionDto.Response.from(
            service.update(id, req.getUserId(), req.getTitle(), req.getContent(), req.getCategory(), st)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestParam Long userId) {
        service.delete(id, userId);
    }
}
