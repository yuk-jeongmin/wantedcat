package aivle0514.backspringboot.post;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import aivle0514.backspringboot.post.PostComment;

@Entity
@Getter      // <-- 추가
@Setter      // <-- 추가
@NoArgsConstructor // <-- 추가 (기본 생성자)
@AllArgsConstructor// <-- 추가 (모든 필드 생성자)
@Builder     // <-- 추가 (빌더 패턴)
@Table(name = "posts")
public class Post {

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
    @Builder.Default // Builder 사용 시 기본값을 설정해주는 어노테이션
    private int views = 0;

    @Column(nullable = false)
    @Builder.Default
    private int likes = 0;

    @OneToMany(mappedBy="post", fetch=FetchType.LAZY)
  @com.fasterxml.jackson.annotation.JsonIgnore
  private List<PostComment> postComments;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // 수동으로 만든 생성자와 @Builder는 삭제합니다.
}