package aivle0514.backspringboot.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserDto.UserResponse> register(@RequestBody UserDto.RegisterRequest requestDto) {
        User registeredUser = userService.registerUser(requestDto);
        return ResponseEntity.ok(new UserDto.UserResponse(registeredUser));
    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto.LoginRequest requestDto) {
    // 1. 사용자 인증 및 JWT 토큰 생성
    // userService.loginUser는 이제 아이디/비밀번호 검증 후 토큰을 문자열로 반환합니다.
        String jwtToken = userService.loginUser(requestDto);

        // 2. HTTP 응답 헤더에 토큰 추가
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + jwtToken);

        // 3. 헤더와 함께 성공 응답 반환 (본문에는 간단한 메시지나 사용자 정보 포함 가능)
        return ResponseEntity.ok()
                .headers(headers)
                .body(new UserDto.LoginResponse("로그인에 성공했습니다."));
        }
    }
}