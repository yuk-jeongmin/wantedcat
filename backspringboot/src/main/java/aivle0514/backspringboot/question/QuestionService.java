package aivle0514.backspringboot.question;

import aivle0514.backspringboot.user.User;
import aivle0514.backspringboot.user.UserRepository;
import lombok.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public Page<Question> list(int page, int size, String category, Question.Status status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (category != null && status != null)
            return questionRepository.findAllByCategoryAndStatus(category, status, pageable);
        if (status != null)
            return questionRepository.findAllByStatusOrderByCreatedAtDesc(status, pageable);
        return questionRepository.findAll(pageable);
    }

    public Question get(Long id) {
        return questionRepository.findById(id).orElseThrow();
    }

    @Transactional
    public Question create(String title, String content, Long userId,
                           String category, Question.Status status) {
        User user = userRepository.findById(userId).orElseThrow();
        Question q = new Question();
        q.setTitle(title);
        q.setContent(content);
        q.setUser(user);
        q.setCategory(category);
        q.setStatus(status != null ? status : Question.Status.문의중);
        q.setViews(0);
        q.setAnswersCount(0);
        return questionRepository.save(q);
    }

    @Transactional
    public Question update(Long id, Long userId, String title, String content,
                           String category, Question.Status status) {
        Question q = questionRepository.findByIdAndUser_Id(id, userId).orElseThrow();
        if (title   != null) q.setTitle(title);
        if (content != null) q.setContent(content);
        if (category!= null) q.setCategory(category);
        if (status  != null) q.setStatus(status);
        return q;
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Question q = questionRepository.findByIdAndUser_Id(id, userId).orElseThrow();
        questionRepository.delete(q);
    }
}
