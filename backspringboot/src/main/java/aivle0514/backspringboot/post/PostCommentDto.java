package aivle0514.backspringboot.post;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

public class PostCommentDto {

    @Data
    @Builder
    public static class Response {
        private Long id;
        private String author;
        private String content;
        private LocalDateTime createdAt;

        public static Response from(PostComment comment) {
            return Response.builder()
                    .id(comment.getId())
                    .author(comment.getAuthor())
                    .content(comment.getContent())
                    .createdAt(comment.getCreatedAt())
                    .build();
        }
    }
}
