package aivle0514.backspringboot.notice;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder @ToString
public class Notice {

  public enum Priority { 일반, 중요, 긴급 }

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, length = 255)
  private String title;

  @Lob @Column(nullable = false)
  private String content;

  @Column(nullable = false, length = 255)
  private String author;

  @Column(name = "created_at", nullable = false)
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(nullable = false, length = 100)
  private String category;   // 예: 모임 안내

  @Builder.Default @Column(nullable = false)
  private Integer views = 0;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 10)
  @Builder.Default
  private Priority priority = Priority.일반;

  @Builder.Default
  @Column(name = "is_pinned", nullable = false)
  private boolean isPinned = false;
}