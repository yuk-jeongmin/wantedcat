package aivle0514.backspringboot.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto.UserResponse> register(@RequestBody UserDto.RegisterRequest requestDto) {
        User registeredUser = userService.registerUser(requestDto);
        return ResponseEntity.ok(new UserDto.UserResponse(registeredUser));
    }
}