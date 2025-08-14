package aivle0514.backspringboot.question;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
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

    /** 작성자 username 문자열 (FK 없음) */
    @Column(name = "author", nullable = false, length = 255)
    private String author;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(nullable = false)
    private int views;

    @Column(name = "answers_count", nullable = false)
    private int answersCount;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    @Builder
    public Question(String title, String content, String author, String category,
                    Status status, Integer views, Integer answersCount, LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
        this.status = status != null ? status : Status.문의중;
        this.views = views != null ? views : 0;
        this.answersCount = answersCount != null ? answersCount : 0;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}
