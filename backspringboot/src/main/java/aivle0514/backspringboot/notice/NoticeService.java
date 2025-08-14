package aivle0514.backspringboot.notice;

import aivle0514.backspringboot.user.User;
import aivle0514.backspringboot.user.UserRepository;
import lombok.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    public Page<Notice> list(int page, int size, String category) {
        Sort sort = Sort.by(Sort.Direction.DESC, "isPinned").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        Pageable pageable = PageRequest.of(page, size, sort);
        if (category != null && !category.isBlank())
            return noticeRepository.findAllByCategoryOrderByIsPinnedDescCreatedAtDesc(category, pageable);
        return noticeRepository.findAllByOrderByIsPinnedDescCreatedAtDesc(pageable);
    }

    public Notice get(Long id) {
        return noticeRepository.findById(id).orElseThrow();
    }

    @Transactional
    public Notice create(String title, String content, Long userId, String category,
                         Notice.Priority priority, Boolean isPinned) {
        User user = userRepository.findById(userId).orElseThrow();
        Notice n = new Notice();
        n.setTitle(title);
        n.setContent(content);
        n.setUser(user);
        n.setCategory(category);
        n.setPriority(priority != null ? priority : Notice.Priority.일반);
        n.setPinned(isPinned != null && isPinned);
        n.setViews(0);
        return noticeRepository.save(n);
    }

    @Transactional
    public Notice update(Long id, Long userId, String title, String content,
                         String category, Notice.Priority priority, Boolean isPinned) {
        Notice n = noticeRepository.findByIdAndUser_Id(id, userId).orElseThrow();
        if (title   != null) n.setTitle(title);
        if (content != null) n.setContent(content);
        if (category!= null) n.setCategory(category);
        if (priority!= null) n.setPriority(priority);
        if (isPinned!= null) n.setPinned(isPinned);
        return n;
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Notice n = noticeRepository.findByIdAndUser_Id(id, userId).orElseThrow();
        noticeRepository.delete(n);
    }
}
