package aivle0514.backspringboot.event;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final BlobServiceClient blobServiceClient;
    private double parseWeight(String weightInfo) {
    if (weightInfo == null || weightInfo.isEmpty()) {
        return 0.0;
    }
    try {
        // "g"와 같은 단위를 제거하고 숫자만 추출
        return Double.parseDouble(weightInfo.replaceAll("[^\\d.]", ""));
    } catch (NumberFormatException e) {
        // 숫자 변환 실패 시 0을 반환
        return 0.0;
    }
    }

    @Autowired
    public EventService(EventRepository eventRepository, @Value("${azure.storage.connection-string}") String connectionString) {
        this.eventRepository = eventRepository;
        this.blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
    }

    public List<EventDto> getDailyEventsByUserId(String userId, LocalDate date) {
        // 해당 날짜의 시작(00:00:00)과 끝(23:59:59) 시간을 계산합니다.
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Repository의 날짜 구간 조회 메소드를 사용하여 이벤트를 가져옵니다.
        List<Event> events = eventRepository.findByUserIdAndEventTimeBetween(userId, startOfDay, endOfDay);

        // 각 Event 객체를 EventDto 객체로 변환하여 리스트로 반환합니다.
        return events.stream()
                .map(EventDto::new)
                .collect(Collectors.toList());
    }
    /**
     * 특정 사용자의 모든 이벤트 기록을 조회하여 DTO 리스트로 반환합니다.
     */
    public List<EventDto> getEventsByUserId(String userId) {
        // Repository를 통해 Event Entity 리스트를 가져옴
        return eventRepository.findByUserIdOrderByEventTimeDesc(userId)
                .stream() // 리스트를 스트림으로 변환
                .map(EventDto::new) // 각 Event 객체를 EventDto 객체로 변환 (event -> new EventDto(event))
                .collect(Collectors.toList()); // 결과를 다시 리스트로 수집
    }

    public String generateSasUrl(String containerName, String blobName) {
        BlobClient blobClient = blobServiceClient.getBlobContainerClient(containerName).getBlobClient(blobName);
        BlobSasPermission permissions = new BlobSasPermission().setReadPermission(true);
        OffsetDateTime expiryTime = OffsetDateTime.now().plusHours(1); // 1시간 동안 유효

        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(expiryTime, permissions);
        String sasToken = blobClient.generateSas(sasValues);

        return String.format("%s?%s", blobClient.getBlobUrl(), sasToken);
    }
    
    public List<DailyCatStatsDto> getDailyStatsByUserId(String userId, LocalDate date) {
        // 해당 날짜의 시작(00:00:00)과 끝(23:59:59) 시간 계산
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // 해당 날짜의 모든 이벤트를 DB에서 조회
        List<Event> events = eventRepository.findByUserIdAndEventTimeBetween(userId, startOfDay, endOfDay);

        // 고양이 이름(catName)으로 이벤트를 그룹화
        Map<String, List<Event>> eventsByCat = events.stream()
                .filter(event -> event.getCatName() != null) // 고양이 이름이 없는 이벤트는 제외
                .collect(Collectors.groupingBy(Event::getCatName));

        // 그룹화된 데이터를 기반으로 고양이별 통계를 계산
        return eventsByCat.entrySet().stream()
                .map(entry -> {
                    String catName = entry.getKey();
                    List<Event> catEvents = entry.getValue();

                    // eventType에 따라 음수량('음수')과 식사량('식사')을 합산
                    // durationSeconds가 양을 나타낸다고 가정
                    double totalWater = catEvents.stream()
                        .filter(e -> "drink".equals(e.getEventType()))
                        .mapToDouble(e -> parseWeight(e.getWeightInfo()))
                        .sum();

                    double totalFood = catEvents.stream()
                            .filter(e -> "meal".equals(e.getEventType()))
                            .mapToDouble(e -> parseWeight(e.getWeightInfo()))
                            .sum();
                    
                    return new DailyCatStatsDto(catName, totalWater, totalFood);
                })
                .collect(Collectors.toList());
    }
}