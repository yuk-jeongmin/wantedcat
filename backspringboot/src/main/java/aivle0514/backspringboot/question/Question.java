package aivle0514.backspringboot.question;

import aivle0514.backspringboot.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "questions")
public class Question {

    public enum Status { 문의중, 답변대기, 답변완료 }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // FK: users.id
    private User user;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, length = 100)
    private String category; // 예: 건강 문의

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(nullable = false)
    private int views;

    @Column(name = "answers_count", nullable = false)
    private int answersCount;

    @Builder
    public Question(String title,
                    String content,
                    User user,
                    String category,
                    Status status,
                    Integer views,
                    Integer answersCount,
                    LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.category = category;
        this.status = status != null ? status : Status.문의중;
        this.views = views != null ? views : 0;
        this.answersCount = answersCount != null ? answersCount : 0;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}
