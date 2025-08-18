package aivle0514.backspringboot.cat;

import aivle0514.backspringboot.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter; 
import java.time.LocalDateTime; 

// 순환참조 막기
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;


@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
@Entity
@Table(name = "cats")
public class Cat {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference  // 순환참조 막기
    private User user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String breed;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private int age;

    @Column(length = 500)
    private String image; // 사진 URL

    @Column(columnDefinition = "TEXT")
    private String memo; // 특이사항

    @Column
    private Float weight;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status", nullable = false)
    private HealthStatus healthStatus; // Enum

    @Column(length = 255)
    private String aiDataFile; // AI 학습용 데이터 파일 경로

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Builder
    public Cat(String name, String breed, String gender, int age, String image, String memo,
               Float weight, HealthStatus healthStatus, String aiDataFile, User user) {
        this.name = name;
//        this.type = type;
        this.breed = breed;
        this.gender = gender;
        this.age = age;
        this.image = image;
        this.memo = memo;
        this.weight = weight;
        this.healthStatus = healthStatus;
        this.aiDataFile = aiDataFile;
        this.user = user;
    }

    // 업데이트 메서드
    public void update(String name, String breed, String gender, int age, String image,
                       String memo, Float weight, HealthStatus healthStatus, String aiDataFile) {
        this.name = name;
        //this.type = type;
        this.breed = breed;
        this.gender = gender;
        this.age = age;
        this.image = image;
        this.memo = memo;
        this.weight = weight;
        this.healthStatus = healthStatus;
        this.aiDataFile = aiDataFile;

    }
}