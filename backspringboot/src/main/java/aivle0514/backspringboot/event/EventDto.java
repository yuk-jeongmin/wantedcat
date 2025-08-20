package aivle0514.backspringboot.event;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
public class EventDto {

    private Integer id;
    private String userId;
    private LocalDateTime eventTime;
    private Float durationSeconds;
    private String weightInfo;
    private String originVideoUrl;
    private String bboxVideoUrl;
    private String eventType;
    private String catName;

    // Entity를 DTO로 변환하는 생성자
    public EventDto(Event event) {
        this.id = event.getId();
        this.userId = event.getUserId();
        this.eventTime = event.getEventTime();
        this.durationSeconds = event.getDurationSeconds();
        this.weightInfo = event.getWeightInfo();
        this.originVideoUrl = event.getOriginVideoUrl();
        this.bboxVideoUrl = event.getBboxVideoUrl();
        this.eventType = event.getEventType();
        this.catName = event.getCatName();
    }
}

/**
 * [추가] 고양이별 일일 통계 데이터를 담는 DTO
 * 특정 날짜의 고양이별 총 음수량과 총 식사량 정보를 전달하는 데 사용됩니다.
 */
@Getter
@Setter
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자를 자동 생성
class DailyCatStatsDto {
    private String catName;          // 고양이 이름
    private double totalWaterIntake; // 총 음수량
    private double totalFoodIntake;  // 총 식사량
}