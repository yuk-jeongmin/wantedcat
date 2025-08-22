// src/main/java/aivle0514/backspringboot/user/UserService.java

package aivle0514.backspringboot.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    /**
     * Spring Security가 로그인 요청을 처리할 때 호출하는 핵심 메소드
     * @param email 로그인 폼에서 'username'으로 설정한 파라미터 값 (우리는 이메일을 사용)
     * @return UserDetails 객체 (사용자 정보, 암호화된 비밀번호, 권한 등을 담고 있음)
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 이메일을 기반으로 사용자를 찾습니다.
        return userRepository.findByEmail(email)
                .map(this::createUserDetails) // 사용자가 있으면 UserDetails 객체로 변환
                .orElseThrow(() -> new UsernameNotFoundException(email + " -> 데이터베이스에서 찾을 수 없습니다."));
    }

    // DB의 User 객체를 Spring Security가 이해할 수 있는 UserDetails 객체로 변환하는 메소드
    private UserDetails createUserDetails(User user) {
        // UserDetails의 구현체인 User 객체를 생성하여 반환합니다.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),          // Principal (사용자를 식별하는 주요 정보, 여기서는 이메일)
                user.getPassword(),       // 암호화된 비밀번호
                Collections.emptyList()   // 권한 목록 (예: "ROLE_USER", "ROLE_ADMIN")
        );
    }

    @Transactional
    public void register(UserDto.RegisterRequest requestDto) {
        if (userRepository.findByEmail(requestDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        User newUser = User.builder()
                .username(requestDto.getUsername())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .email(requestDto.getEmail())
                .build();

        userRepository.save(newUser);
    }

    @Transactional
    public void resetPassword(UserFindDto.PasswordResetRequest requestDto) {
        User user = userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        user.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserDto.UserResponse getUserInfoByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        return new UserDto.UserResponse(user);
    }

    // 마이페이지 수정.
    @Transactional
    public UserDto.UserResponse updateUser(String email, UserDto.UpdateRequest requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        user.update(requestDto.getUsername(), requestDto.getEmail(), requestDto.getProfileImage());
        userRepository.save(user);

        return new UserDto.UserResponse(user);
    }

    @Transactional
    public void changePassword(String email, UserDto.PasswordChangeRequest requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(requestDto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));
        userRepository.save(user);
    }
}
