package aivle0514.backspringboot.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.time.LocalDate;
import java.util.Collections; // [수정] Collections 클래스를 import 합니다.
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getEventsByUserId(
            @RequestParam String userId,
            // 'date' 파라미터를 LocalDate 타입으로 받도록 추가합니다.
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        // 날짜 필터링을 수행하는 새로운 서비스 메소드를 호출합니다.
        List<EventDto> events = eventService.getDailyEventsByUserId(userId, date);
        return ResponseEntity.ok(events);
    }


    @GetMapping("/stats")
    public ResponseEntity<List<DailyCatStatsDto>> getDailyStats(
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<DailyCatStatsDto> stats = eventService.getDailyStatsByUserId(userId, date);
        return ResponseEntity.ok(stats);
    }

    
    @PostMapping("/video/sas")
    public ResponseEntity<Map<String, String>> getSasVideoUrl(@RequestBody Map<String, String> payload) {
        try {
            String originalUrl = payload.get("videoUrl");
            if (originalUrl == null || originalUrl.isEmpty()) {
                return ResponseEntity.badRequest().body(Collections.singletonMap("message", "videoUrl이 필요합니다."));
            }

            URL url = new URL(originalUrl);
            String path = url.getPath();
            String[] parts = path.substring(1).split("/", 2);
            String containerName = parts[0];
            String blobName = parts[1];

            // [수정] 컨트롤러가 직접 만들지 않고, EventService에 요청합니다.
            String sasUrl = eventService.generateSasUrl(containerName, blobName);

            return ResponseEntity.ok(Collections.singletonMap("videoUrl", sasUrl));

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = Collections.singletonMap("message", "SAS URL 생성에 실패했습니다.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}