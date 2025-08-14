package aivle0514.backspringboot.device;

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


}