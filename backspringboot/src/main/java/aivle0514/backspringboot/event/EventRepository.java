package aivle0514.backspringboot.event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime; 

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    /**
     * user_id를 기준으로 모든 이벤트를 event_time 내림차순으로 조회합니다.
     * 메서드 이름 규칙에 따라 Spring Data JPA가 자동으로 쿼리를 생성합니다.
     * SQL: SELECT * FROM events WHERE user_id = ? ORDER BY event_time DESC
     */
    List<Event> findByUserIdOrderByEventTimeDesc(String userId);

    /**
     * [추가] userId와 특정 시간 구간(시작, 끝)으로 이벤트를 조회하는 메소드
     * SQL: SELECT * FROM events WHERE user_id = ? AND event_time BETWEEN ? AND ?
     */
    List<Event> findByUserIdAndEventTimeBetween(String userId, LocalDateTime start, LocalDateTime end);
}