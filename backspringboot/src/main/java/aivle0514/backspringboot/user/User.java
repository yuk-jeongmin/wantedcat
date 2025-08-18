package aivle0514.backspringboot.user;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.UUID;

// 순환참조 막기
import java.util.List;
import java.util.ArrayList;
import aivle0514.backspringboot.cat.Cat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String joinDate;

    @Column(nullable = false)
    private String role;

    @Column(unique = true, nullable = false)
    private String streamKey;

    public void setPassword(String password) {
        this.password = password;
    }

    @Builder
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.joinDate = java.time.OffsetDateTime.now().toString();
        this.role = "user"; // 기본 역할 'user'로 설정
        this.streamKey = UUID.randomUUID().toString();
    }
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference   // 순환참조 방지
    private List<Cat> cats = new ArrayList<>();
}