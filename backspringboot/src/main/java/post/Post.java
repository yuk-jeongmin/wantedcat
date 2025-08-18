package aivle0514.backspringboot.post;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "posts")
public class Post {

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

    @Column(nullable = false)
    private int likes;

    @Column(name = "comments", nullable = false)
    private int comments;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    @Builder
    public Post(String title, String content, String author, String category,
                Integer views, Integer likes, Integer comments, LocalDateTime createdAt) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.category = category;
        this.views = views != null ? views : 0;
        this.likes = likes != null ? likes : 0;
        this.comments = comments != null ? comments : 0;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}
