package aivle0514.backspringboot.question;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder @ToString
public class Question {

  public enum Status { 문의중, 답변대기, 답변완료 }

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
  private String category;   // 예: 건강 문의

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  @Builder.Default
  private Status status = Status.문의중;

  @Builder.Default @Column(nullable = false)
  private Integer views = 0;

  @Builder.Default
  @Column(name = "answers_count", nullable = false)
  private Integer answersCount = 0;
}