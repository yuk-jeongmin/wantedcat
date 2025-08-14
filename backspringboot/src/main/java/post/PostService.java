package aivle0514.backspringboot.post;

import aivle0514.backspringboot.user.User;
import aivle0514.backspringboot.user.UserRepository;
import lombok.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

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
    public Post create(String title, String content, Long userId, String category) {
        User user = userRepository.findById(userId).orElseThrow();
        Post p = new Post();
        p.setTitle(title);
        p.setContent(content);
        p.setUser(user);
        p.setCategory(category);
        p.setViews(0);
        p.setLikes(0);
        p.setComments(0);
        return postRepository.save(p);
    }

    @Transactional
    public Post update(Long id, Long userId, String title, String content, String category) {
        Post p = postRepository.findByIdAndUser_Id(id, userId).orElseThrow(); // 소유자 검증
        if (title   != null) p.setTitle(title);
        if (content != null) p.setContent(content);
        if (category!= null) p.setCategory(category);
        return p; // dirty checking으로 flush 시 자동 업데이트
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Post p = postRepository.findByIdAndUser_Id(id, userId).orElseThrow();
        postRepository.delete(p);
    }
}