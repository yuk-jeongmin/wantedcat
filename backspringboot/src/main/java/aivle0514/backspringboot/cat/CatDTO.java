package aivle0514.backspringboot.cat;


import jakarta.validation.constraints.*;
import lombok.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class CatDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Post {
        @NotNull
        private Long userId;

        @NotBlank
        private String name;

        @NotBlank
        private String type;

        @NotBlank
        private String gender;

        @NotNull
        private int age;

        private String image;
        private String memo;
        private Float weight;

        @NotNull
        private HealthStatus healthStatus; // Enum 사용

        private String aiDataFile;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Put {
        @NotBlank
        private String name;

        @NotBlank
        private String type;

        @NotBlank
        private String gender;

        @NotNull
        private int age;

        private String image;
        private String memo;
        private Float weight;

        @NotNull
        private HealthStatus healthStatus; // Enum 사용

        private String aiDataFile;
    }

    @Getter
    @Setter
    @Builder
    public static class Response {
        private Long catId;
        private Long userId;
        private String name;
        private String type;
        private String gender;
        private int age;
        private String image;
        private String memo;
        private Float weight;
        private HealthStatus healthStatus; // Enum
        private String aiDataFile;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
