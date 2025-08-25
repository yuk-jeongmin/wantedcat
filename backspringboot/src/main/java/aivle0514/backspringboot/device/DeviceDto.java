package aivle0514.backspringboot.device;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class DeviceDto {

    @Getter
    @Setter
    public static class AddRequest {
        private String devicename;
        private String type;
        private String wifiName;
        private String location;
    }

    @Getter
    @Setter
    public static class UpdateRequest {
        private String devicename;
        private String type;
        private String wifiName;
        private String location;
    }

    // 추가-jks : 응답용 DTO (Lazy 오류 해결을 위함)
    @Builder
    public record Response(
        Long id,
        String devicename,
        String type,
        String location,
        String wifiName,
        Long userId
    ) {
        public static Response from(Device d) {
            return Response.builder()
                .id(d.getId())
                .devicename(d.getDevicename())
                .type(d.getType())
                .location(d.getLocation())
                .wifiName(d.getWifiName())
                .userId(d.getUser() != null ? d.getUser().getId() : null)
                .build();
        }
    }
}