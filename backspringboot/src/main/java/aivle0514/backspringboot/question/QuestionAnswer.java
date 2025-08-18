package aivle0514.backspringboot.question;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter 
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "question_answers")
public class QuestionAnswer {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** FK: questions.id (CASCADE ON DELETE) */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Lob @Column(nullable = false)
    private String content;

    /** 작성자 username 문자열 (FK 없음) */
    @Column(name = "author", nullable = false, length = 255)
    private String author;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    @Builder
    public QuestionAnswer(Question question, String content, String author, LocalDateTime createdAt) {
        this.question = question;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}
