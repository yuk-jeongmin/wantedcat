package aivle0514.backspringboot.cat;


import jakarta.validation.constraints.*;
import lombok.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class CatDTO {

    @Getter
    @Setter
    public static class AddRequestCat {
        // private Long userId;
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
