package aivle0514.backspringboot.post;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore; // Added for circular reference fix

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Table(name = "post_comments")
public class PostComment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)        // FK: post_id
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnore // Prevents circular reference during JSON serialization
    private Post post;

    @Column(nullable = false, length = 255)
    private String author;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }

    @Builder
    public PostComment(Post post, String author, String content, LocalDateTime createdAt) {
        this.post = post;
        this.author = author;
        this.content = content;
        this.createdAt = createdAt;
    }
}