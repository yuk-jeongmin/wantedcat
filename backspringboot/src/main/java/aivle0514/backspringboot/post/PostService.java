package aivle0514.backspringboot.post;

import lombok.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;

    public Page<PostDto.Response> listAsDto(int page, int size, String category, String q) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Post> posts;
        if (q != null && !q.isBlank()) {
            posts = postRepository.findAllByTitleContainingOrContentContaining(q, q, pageable);
        } else if (category != null && !category.isBlank()) {
            posts = postRepository.findAllByCategoryOrderByCreatedAtDesc(category, pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }
        // ⚠️ 이 map은 여전히 트랜잭션(readOnly) 안에서 수행됨 → LAZY 안전
        return posts.map(PostDto.Response::from);
    }

    public PostDto.Response getAsDto(Long id) {
        Post p = postRepository.findById(id).orElseThrow();
        return PostDto.Response.from(p);
    }

    @Transactional
    public PostDto.Response createAsDto(PostDto.CreateRequest req) {
        Post p = new Post();
        p.setTitle(req.getTitle());
        p.setContent(req.getContent());
        p.setAuthor(req.getAuthor());
        p.setCategory(req.getCategory());
        p.setViews(0);
        p.setLikes(0);
        Post saved = postRepository.save(p);
        return PostDto.Response.from(saved);
    }

    @Transactional
    public PostDto.Response updateAsDto(Long id, PostDto.UpdateRequest req) {
        Post p = postRepository.findByIdAndAuthor(id, req.getAuthor()).orElseThrow();
        if (req.getTitle() != null) p.setTitle(req.getTitle());
        if (req.getContent() != null) p.setContent(req.getContent());
        if (req.getCategory() != null) p.setCategory(req.getCategory());
        return PostDto.Response.from(p);
    }

    @Transactional
    public void delete(Long id, String author, String userRole) {
        Post p = "admin".equals(userRole)
                ? postRepository.findById(id).orElseThrow()
                : postRepository.findByIdAndAuthor(id, author).orElseThrow();
        postRepository.delete(p);
    }

    @Transactional
    public void increaseViewCount(Long id) {
        Post p = postRepository.findById(id).orElseThrow();
        p.setViews(p.getViews() + 1);
    }
}