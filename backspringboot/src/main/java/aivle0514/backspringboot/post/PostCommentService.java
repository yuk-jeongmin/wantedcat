package aivle0514.backspringboot.post;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostCommentService {

    private final PostRepository postRepository;
    private final PostCommentRepository commentRepository;

    @Transactional(readOnly = true)
    public List<PostComment> list(Long postId) {
        return commentRepository.findByPostIdOrderByIdAsc(postId);
    }

    public PostComment add(Long postId, String author, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 없습니다: " + postId));

        PostComment saved = commentRepository.save(
                PostComment.builder()
                        .post(post)
                        .author(author)
                        .content(content)
                        .build()
        );

        return saved;
    }

    public void delete(Long postId, Long commentId, String authorOrNull) {
        PostComment c = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 없습니다: " + commentId));

        if (!c.getPost().getId().equals(postId)) {
            throw new IllegalStateException("게시물-댓글 매칭 불일치");
        }
        // 작성자 검증이 필요하면 여기서 체크
        if (authorOrNull != null && !authorOrNull.equals(c.getAuthor())) {
            throw new IllegalStateException("삭제 권한 없음(작성자 불일치)");
        }

        commentRepository.delete(c);
    }
}