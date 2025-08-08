package aivle0514.backspringboot.user;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody UserDto.RegisterRequest requestDto) {
        userService.register(requestDto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto.LoginResponse> login(@RequestBody UserDto.LoginRequest requestDto) {
        String message = userService.login(requestDto);
        return ResponseEntity.ok(new UserDto.LoginResponse(message));
    }

    @PostMapping("/find-email")
    public ResponseEntity<UserFindDto.EmailFindResponse> findEmail(@RequestBody UserFindDto.EmailFindRequest requestDto) {
        String email = userService.findEmailByUsername(requestDto.getUsername());
        return ResponseEntity.ok(new UserFindDto.EmailFindResponse(email));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody UserFindDto.PasswordResetRequest requestDto) {
        userService.resetPassword(requestDto);
        return ResponseEntity.ok("비밀번호 재설정 성공");
    }
}