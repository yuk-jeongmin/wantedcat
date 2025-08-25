package aivle0514.backspringboot.post;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService service;

    // 목록: 쿼리 파라미터 방식 유지 (category, q 지원)
    @GetMapping
    public Page<PostDto.Response> list(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(required = false) String category,
                                       @RequestParam(required = false) String q) {
        return service.listAsDto(page, size, category, q);
    }

    // 단건 조회
    @GetMapping("/{id}")
    public PostDto.Response get(@PathVariable Long id) {
        return service.getAsDto(id);
    }

    // 생성
    @PostMapping
    public PostDto.Response create(@Valid @RequestBody PostDto.CreateRequest req) {
        return service.createAsDto(req);
    }

    // 수정
    @PutMapping("/{id}")
    public PostDto.Response update(@PathVariable Long id, @Valid @RequestBody PostDto.UpdateRequest req) {
        return service.updateAsDto(id, req);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       @RequestParam String author,
                       @RequestParam String userRole) {
        service.delete(id, author, userRole);
    }

    // 조회수 증가
    @PostMapping("/{id}/view")
    public void increaseViewCount(@PathVariable Long id) {
        service.increaseViewCount(id);
    }
}
