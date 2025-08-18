// src/main/java/aivle0514/backspringboot/device/Device.java
package aivle0514.backspringboot.device;
import aivle0514.backspringboot.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "devices") // DB 테이블 이름을 'devices'로 지정
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String devicename;

    @Column(nullable = false)
    private String type;

    @Column(name = "wifi_name") // DB 컬럼명은 snake_case로
    private String wifiName;

    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // DB에 user_id 외래키 생성
    private User user;

    @Builder
    public Device(String devicename, String type, String wifiName, String location, User user) {
        this.devicename = devicename;
        this.type = type;
        this.wifiName = wifiName;
        this.location = location;
        this.user = user; // 빌더에 user 추가
    }

    public void update(String devicename, String type, String wifiName, String location) {
        this.devicename = devicename;
        this.type = type;
        this.wifiName = wifiName;
        this.location = location;
    }
}