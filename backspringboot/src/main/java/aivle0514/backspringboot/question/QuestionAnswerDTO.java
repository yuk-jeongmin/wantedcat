package aivle0514.backspringboot.question.dto;

import aivle0514.backspringboot.question.QuestionAnswer;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class QuestionAnswerDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotNull  private Long   questionId;
        @NotBlank private String content;
        @NotBlank private String author;     // 문자열
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private Long questionId;
        private String content;
        private String author;
        private LocalDateTime createdAt;

        public static Response from(QuestionAnswer a){
            return Response.builder()
                .id(a.getId())
                .questionId(a.getQuestion()!=null ? a.getQuestion().getId() : null)
                .content(a.getContent())
                .author(a.getAuthor())
                .createdAt(a.getCreatedAt())
                .build();
        }
    }
}
