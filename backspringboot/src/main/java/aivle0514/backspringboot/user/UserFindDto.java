// UserFindDto.java
package aivle0514.backspringboot.user;

import lombok.Getter;
import lombok.Setter;

public class UserFindDto {

    // 이메일(아이디) 찾기 요청
    @Getter
    @Setter
    public static class EmailFindRequest {
        private String username; // 이름으로 이메일 검색
    }

    // 이메일(아이디) 찾기 응답
    @Getter
    public static class EmailFindResponse {
        private final String email;

        public EmailFindResponse(String email) {
            this.email = email;
        }
    }

    // 비밀번호 재설정 요청
    @Getter
    @Setter
    public static class PasswordResetRequest {
        private String email;
        private String newPassword;
    }
}