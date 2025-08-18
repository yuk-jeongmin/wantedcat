package aivle0514.backspringboot.notice;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "notices")
public class Notice {

    public enum Priority { 일반, 중요, 긴급 }

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

    @Column(nullable = false)
    private int views;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Priority priority;

    @Column(name = "is_pinned", nullable = false)
    private boolean isPinned;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    @Builder
    public Notice(String title, String content, String author, String category,
                  Priority priority, Boolean isPinned, Integer views, LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
        this.priority = priority != null ? priority : Priority.일반;
        this.isPinned = isPinned != null && isPinned;
        this.views = views != null ? views : 0;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}
