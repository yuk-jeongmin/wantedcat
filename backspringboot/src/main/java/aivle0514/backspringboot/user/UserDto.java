package aivle0514.backspringboot.user;

import lombok.Getter;
import lombok.Setter;

public class UserDto {

    @Getter
    @Setter
    public static class RegisterRequest {
        private String username;
        private String password;
    }

    @Getter
    public static class UserResponse {
        private final Long id;
        private final String username;
        private final String streamKey;

        public UserResponse(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.streamKey = user.getStreamKey();
        }
    }
}