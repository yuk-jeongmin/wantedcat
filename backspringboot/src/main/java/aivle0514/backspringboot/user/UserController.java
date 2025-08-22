package aivle0514.backspringboot.user;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

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
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody UserFindDto.PasswordResetRequest requestDto) {
        userService.resetPassword(requestDto);
        return ResponseEntity.ok("비밀번호 재설정 성공");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto.UserResponse> getMyInfo(Authentication authentication) {
        // 인증 객체에서 사용자 이메일을 가져옵니다.
        String userEmail = authentication.getName();
        
        // 이메일을 사용해 사용자 정보를 조회하고 Dto로 변환합니다.
        UserDto.UserResponse userInfo = userService.getUserInfoByEmail(userEmail);
        
        // 조회된 사용자 정보를 응답으로 보냅니다.
        return ResponseEntity.ok(userInfo);
    }

    //마이페이지 
    // 프로필 수정 (이름, 이메일, 프로필 이미지)
    @PutMapping("/update")
    public ResponseEntity<UserDto.UserResponse> updateMyInfo(
            Authentication authentication,
            @RequestBody UserDto.UpdateRequest requestDto) {

        String userEmail = authentication.getName();
        UserDto.UserResponse updatedUser = userService.updateUser(userEmail, requestDto);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestBody UserDto.PasswordChangeRequest requestDto) {
        
        String userEmail = authentication.getName();
        userService.changePassword(userEmail, requestDto);
        return ResponseEntity.ok("비밀번호 변경 성공");
    }

}
