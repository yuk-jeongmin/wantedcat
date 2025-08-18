package aivle0514.backspringboot.question;

import aivle0514.backspringboot.question.Question;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class QuestionDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotBlank private String title;
        @NotBlank private String content;
        @NotBlank private String author;   // 문자열
        @NotBlank private String category;
                  private String status;   // "문의중" | "답변대기" | "답변완료"
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateRequest {
        @NotBlank private String author;
                  private String title;
                  private String content;
                  private String category;
                  private String status;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String author;
        private String category;
        private String status;
        private int views;
        private int answersCount;
        private LocalDateTime createdAt;

        public static Response from(Question q){
            return Response.builder()
                .id(q.getId())
                .title(q.getTitle())
                .content(q.getContent())
                .author(q.getAuthor())
                .category(q.getCategory())
                .status(q.getStatus()!=null ? q.getStatus().name() : null)
                .views(q.getViews())
                .answersCount(q.getAnswersCount())
                .createdAt(q.getCreatedAt())
                .build();
        }
    }
}
