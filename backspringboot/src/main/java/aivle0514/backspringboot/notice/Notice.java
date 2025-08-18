package aivle0514.backspringboot.notice;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter      // <-- 추가
@Setter      // <-- 추가
@NoArgsConstructor // <-- 추가 (기본 생성자)
@AllArgsConstructor// <-- 추가 (모든 필드 생성자)
@Builder     // <-- 추가 (빌더 패턴)
@Table(name = "notices")
public class Notice {

    public enum Priority { 일반, 중요, 긴급 }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob @Column(nullable = false)
    private String content;

    @Column(name = "author", nullable = false, length = 255)
    private String author;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    @Builder.Default // [수정] Builder 기본값 설정
    private int views = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default // [수정] Builder 기본값 설정
    private Priority priority = Priority.일반;

    @Column(name = "is_pinned", nullable = false)
    @Builder.Default // [수정] Builder 기본값 설정
    private boolean isPinned = false;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // [수정] 수동으로 만든 생성자는 삭제합니다.
}