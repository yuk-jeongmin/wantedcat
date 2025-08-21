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
        @NotBlank private String author;   // 변경: userId -> author
        @NotBlank private String category;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateRequest {
        @NotBlank private String author;   // 작성자 검증용
                  private String title;
                  private String content;
                  private String category;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String author;
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
                .author(p.getAuthor())
                .category(p.getCategory())
                .views(p.getViews())
                .likes(p.getLikes())
                .comments(p.getPostComments() != null ? p.getPostComments().size() : 0)
                .createdAt(p.getCreatedAt())
                .build();
        }
    }
}
