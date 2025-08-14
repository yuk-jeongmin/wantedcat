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

    public Page<Post> list(int page, int size, String category, String q) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (q != null && !q.isBlank()) return postRepository.findAllByTitleContainingOrContentContaining(q, q, pageable);
        if (category != null && !category.isBlank()) return postRepository.findAllByCategoryOrderByCreatedAtDesc(category, pageable);
        return postRepository.findAll(pageable);
    }

    public Post get(Long id) {
        return postRepository.findById(id).orElseThrow();
    }

    @Transactional
    public Post create(String title, String content, String author, String category) {
        Post p = new Post();
        p.setTitle(title);
        p.setContent(content);
        p.setAuthor(author);
        p.setCategory(category);
        p.setViews(0);
        p.setLikes(0);
        p.setComments(0);
        return postRepository.save(p);
    }

    @Transactional
    public Post update(Long id, String author, String title, String content, String category) {
        Post p = postRepository.findByIdAndAuthor(id, author).orElseThrow(); // 작성자 검증
        if (title   != null) p.setTitle(title);
        if (content != null) p.setContent(content);
        if (category!= null) p.setCategory(category);
        return p;
    }

    @Transactional
    public void delete(Long id, String author) {
        Post p = postRepository.findByIdAndAuthor(id, author).orElseThrow();
        postRepository.delete(p);
    }
}
