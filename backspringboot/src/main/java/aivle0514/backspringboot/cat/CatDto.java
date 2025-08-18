package aivle0514.backspringboot.cat;
import aivle0514.backspringboot.cat.HealthStatus;
import lombok.*;

public class CatDto {

    @Getter
    @Setter
    @Builder // [수정] 추가
    @NoArgsConstructor // [수정] 추가
    @AllArgsConstructor // [수정] 추가
    public static class AddRequestCat {
        private String name;
        private String breed;
        private String gender;
        private int age;
        private String image;
        private String memo;
        private Float weight;
        private HealthStatus healthStatus;
        private String aiDataFile;
    }

    @Getter
    @Setter
    @Builder // [수정] 추가
    @NoArgsConstructor // [수정] 추가
    @AllArgsConstructor // [수정] 추가
    public static class UpdateRequestCat {
        private String name;
        private String breed;
        private String gender;
        private int age;
        private String image;
        private String memo;
        private Float weight;
        private HealthStatus healthStatus;
        private String aiDataFile;
    }

}