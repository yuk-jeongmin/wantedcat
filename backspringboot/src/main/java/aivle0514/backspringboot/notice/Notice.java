package aivle0514.backspringboot.notice;

import aivle0514.backspringboot.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // FK: users.id
    private User user;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, length = 100)
    private String category; // 예: 모임 안내

    @Column(nullable = false)
    private int views;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Priority priority;

    @Column(name = "is_pinned", nullable = false)
    private boolean isPinned;

    @Builder
    public Notice(String title,
                  String content,
                  User user,
                  String category,
                  Priority priority,
                  Boolean isPinned,
                  Integer views,
                  LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.category = category;
        this.priority = priority != null ? priority : Priority.일반;
        this.isPinned = isPinned != null && isPinned;
        this.views = views != null ? views : 0;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}