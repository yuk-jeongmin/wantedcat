package aivle0514.backspringboot.notice;

import aivle0514.backspringboot.notice.dto.NoticeDto;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService service;

    @GetMapping
    public Page<NoticeDto.Response> list(@RequestParam(defaultValue="0") int page,
                                         @RequestParam(defaultValue="10") int size,
                                         @RequestParam(required=false) String category) {
        return service.list(page, size, category).map(NoticeDto.Response::from);
    }

    @GetMapping("/{id}")
    public NoticeDto.Response get(@PathVariable Long id) {
        return NoticeDto.Response.from(service.get(id));
    }

    @PostMapping
    public NoticeDto.Response create(@Valid @RequestBody NoticeDto.CreateRequest req) {
        Notice.Priority pr = req.getPriority()!=null ? Notice.Priority.valueOf(req.getPriority()) : null;
        return NoticeDto.Response.from(
            service.create(req.getTitle(), req.getContent(), req.getUserId(), req.getCategory(), pr, req.getIsPinned())
        );
    }

    @PutMapping("/{id}")
    public NoticeDto.Response update(@PathVariable Long id, @Valid @RequestBody NoticeDto.UpdateRequest req) {
        Notice.Priority pr = req.getPriority()!=null ? Notice.Priority.valueOf(req.getPriority()) : null;
        return NoticeDto.Response.from(
            service.update(id, req.getUserId(), req.getTitle(), req.getContent(), req.getCategory(), pr, req.getIsPinned())
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestParam Long userId) {
        service.delete(id, userId);
    }
}
