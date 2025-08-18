package aivle0514.backspringboot.question;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter 
@Setter
@Builder // [수정] 클래스 레벨로 이동
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor // [수정] Builder를 위해 추가
@Table(name = "questions")
public class Question {

    public enum Status { 문의중, 답변대기, 답변완료 }

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default // [수정] Builder 기본값 설정
    private Status status = Status.문의중;

    @Column(nullable = false)
    @Builder.Default // [수정] Builder 기본값 설정
    private int views = 0;

    @Column(name = "answers_count", nullable = false)
    @Builder.Default // [수정] Builder 기본값 설정
    private int answersCount = 0;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // [수정] 수동으로 만든 생성자는 삭제합니다.
}