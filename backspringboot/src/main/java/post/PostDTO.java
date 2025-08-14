package aivle0514.backspringboot.post;

import aivle0514.backspringboot.post.Post;
import lombok.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class PostDto {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateRequest {
        @NotBlank private String title;
        @NotBlank private String content;
        @NotNull  private Long   userId;   // FK: users.id
        @NotBlank private String category;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateRequest {
        @NotNull  private Long   userId;   // 소유자 검증용
                  private String title;
                  private String content;
                  private String category;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private Long userId;
        private String category;
        private int views;
        private int likes;
        private int comments;
        private LocalDateTime createdAt;

        public static Response from(Post p){
            return Response.builder()
                .id(p.getId())
                .title(p.getTitle())
                .content(p.getContent())
                .userId(p.getUser()!=null ? p.getUser().getId() : null)
                .category(p.getCategory())
                .views(p.getViews())
                .likes(p.getLikes())
                .comments(p.getComments())
                .createdAt(p.getCreatedAt())
                .build();
        }
    }
}
