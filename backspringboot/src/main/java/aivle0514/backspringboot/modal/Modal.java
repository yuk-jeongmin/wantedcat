package aivle0514.backspringboot.user;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "modals") // 데이터베이스에 'users'라는 이름의 테이블로 생성
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username; // 사용자 ID (이메일 형식 등)

    @Column(nullable = false)
    private String password; // 비밀번호 (반드시 암호화하여 저장해야 함)

    @Column(unique = true, nullable = false)
    private String streamKey; // 개인별 스트림 키

    @Builder
    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.streamKey = UUID.randomUUID().toString(); // ✨ 객체 생성 시 고유한 스트림 키 자동 생성
    }
}