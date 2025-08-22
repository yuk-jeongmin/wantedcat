package aivle0514.backspringboot.post;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class PostCommentController {

    private final PostCommentService commentService;

    @GetMapping
    public ResponseEntity<List<PostCommentDto.Response>> list(@PathVariable("postId") Long postId) {
        List<PostComment> comments = commentService.list(postId);
        // Map PostComment entities to PostCommentDto.Response DTOs
        List<PostCommentDto.Response> responseList = comments.stream()
                .map(PostCommentDto.Response::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    public static class CommentRequest {
        public String author;
        public String content;
    }

    @PostMapping
    public ResponseEntity<PostComment> add(@PathVariable("postId") Long postId, @RequestBody CommentRequest req) {
        return ResponseEntity.ok(commentService.add(postId, req.author, req.content));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            @PathVariable("postId") Long postId,
            @PathVariable("commentId") Long commentId,
            @RequestHeader(value = "X-USER-NAME", required = false) String author
    ) {
        commentService.delete(postId, commentId, author);
        return ResponseEntity.ok().build();
    }
}