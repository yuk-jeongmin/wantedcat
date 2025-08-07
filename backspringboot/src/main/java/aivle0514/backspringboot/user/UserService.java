package aivle0514.backspringboot.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerUser(UserDto.RegisterRequest dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        User newUser = User.builder()
                .username(dto.getUsername())
                .password(encodedPassword)
                .email(dto.getEmail())
                .build();

        return userRepository.save(newUser);
    }
    
    @Transactional(readOnly = true)
    public String loginUser(UserDto.LoginRequest dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("잘못된 비밀번호입니다.");
        }
        return "temp-jwt-token-for-" + user.getUsername();
    }
}