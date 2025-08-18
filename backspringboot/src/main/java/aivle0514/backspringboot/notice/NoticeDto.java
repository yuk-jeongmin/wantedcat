package aivle0514.backspringboot.notice;

import aivle0514.backspringboot.notice.Notice;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class NoticeDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotBlank private String title;
        @NotBlank private String content;
        @NotBlank private String author;    // 문자열
        @NotBlank private String category;
                  private String  priority; // "일반" | "중요" | "긴급"
                  private Boolean isPinned;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateRequest {
        @NotBlank private String author;
                  private String title;
                  private String content;
                  private String category;
                  private String priority;
                  private Boolean isPinned;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String author;
        private String category;
        private String priority;
        private boolean isPinned;
        private int views;
        private LocalDateTime createdAt;

        public static Response from(Notice n){
            return Response.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .author(n.getAuthor())
                .category(n.getCategory())
                .priority(n.getPriority()!=null ? n.getPriority().name() : null)
                .isPinned(n.isPinned())
                .views(n.getViews())
                .createdAt(n.getCreatedAt())
                .build();
        }
    }
}
