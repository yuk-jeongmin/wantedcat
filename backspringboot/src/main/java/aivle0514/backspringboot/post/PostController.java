package aivle0514.backspringboot.post;

import aivle0514.backspringboot.post.PostDto;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService service;

    @GetMapping
    public Page<PostDto.Response> list(@RequestParam(defaultValue="0") int page,
                                       @RequestParam(defaultValue="10") int size,
                                       @RequestParam(required=false) String category,
                                       @RequestParam(required=false) String q) {
        return service.list(page, size, category, q).map(PostDto.Response::from);
    }

    @GetMapping("/{id}")
    public PostDto.Response get(@PathVariable Long id) {
        return PostDto.Response.from(service.get(id));
    }

    @PostMapping
    public PostDto.Response create(@Valid @RequestBody PostDto.CreateRequest req) {
        return PostDto.Response.from(service.create(req.getTitle(), req.getContent(), req.getAuthor(), req.getCategory()));
    }

    @PutMapping("/{id}")
    public PostDto.Response update(@PathVariable Long id, @Valid @RequestBody PostDto.UpdateRequest req) {
        return PostDto.Response.from(service.update(id, req.getAuthor(), req.getTitle(), req.getContent(), req.getCategory()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @RequestParam String author, @RequestParam String userRole) {
        service.delete(id, author, userRole);
    }

    @PostMapping("/{id}/view")
    public void increaseViewCount(@PathVariable Long id) {
        service.increaseViewCount(id);
    }
}
