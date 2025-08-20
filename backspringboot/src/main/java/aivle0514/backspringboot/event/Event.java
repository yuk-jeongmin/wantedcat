package aivle0514.backspringboot.event;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter // 모든 필드의 Getter를 자동 생성
@Setter // 모든 필드의 Setter를 자동 생성
@NoArgsConstructor // 파라미터가 없는 기본 생성자를 자동 생성
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "event_time")
    private LocalDateTime eventTime;

    @Column(name = "duration_seconds")
    private Float durationSeconds;

    @Column(name = "weight_info")
    private String weightInfo;

    @Column(name = "origin_video_url")
    private String originVideoUrl;

    @Column(name = "bbox_video_url")
    private String bboxVideoUrl;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "cat_name")
    private String catName;

    // Getters, Setters, 기본 생성자 등은 Lombok 어노테이션(@Getter, @Setter, @NoArgsConstructor)을 사용하거나 직접 추가합니다.
}