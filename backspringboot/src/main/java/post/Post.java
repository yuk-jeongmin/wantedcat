package aivle0514.backspringboot.post;

import aivle0514.backspringboot.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "posts")
public class Post {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // DB에 user_id 외래키 생성
    private User user;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, length = 100)
    private String category; // 예: 장난감 추천

    @Column(nullable = false)
    private int views;

    @Column(nullable = false)
    private int likes;

    @Column(name = "comments", nullable = false)
    private int comments;

    @Builder
    public Post(String title,
                String content,
                User user,
                String category,
                Integer views,
                Integer likes,
                Integer comments,
                LocalDateTime createdAt) {

        this.title = title;
        this.content = content;
        this.user = user;
        this.category = category;
        this.views = views != null ? views : 0;
        this.likes = likes != null ? likes : 0;
        this.comments = comments != null ? comments : 0;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }
}
