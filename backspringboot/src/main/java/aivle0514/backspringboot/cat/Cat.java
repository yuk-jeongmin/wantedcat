package aivle0514.backspringboot.cat;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "cats")
public class Cat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long catId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private int age;

    @Column(length = 255)
    private String image; // 사진 URL

    @Column(columnDefinition = "TEXT")
    private String memo; // 특이사항

    @Column
    private Float weight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HealthStatus healthStatus; // Enum

    @Column(length = 255)
    private String aiDataFile; // AI 학습용 데이터 파일 경로

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;
}
