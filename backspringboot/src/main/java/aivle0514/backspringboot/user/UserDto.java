package aivle0514.backspringboot.user;

import lombok.Getter;
import lombok.Setter;

public class UserDto {

    @Getter
    @Setter
    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
    }

    @Getter
    @Setter
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Getter
    public static class LoginResponse {
        private final String message;
        // 필요하다면 여기에 UserResponse 객체를 포함하여 로그인 시 사용자 정보를 반환할 수도 있습니다.
        // private final UserResponse userInfo;

        public LoginResponse(String message) {
            this.message = message;
        }
    }

    // ✨ User 엔티티의 모든 정보를 포함하도록 업데이트된 응답 Dto
    @Getter
    public static class UserResponse {
        private final Long id;
        private final String username;
        private final String email;
        private final String joinDate;
        private final String role;
        private final String streamKey;

        public UserResponse(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.email = user.getEmail();
            this.joinDate = user.getJoinDate();
            this.role = user.getRole();
            this.streamKey = user.getStreamKey();
        }
    }
}