package aivle0514.backspringboot.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. 비밀번호 암호화 기능 (사용자님 코드에서 가져옴)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            // 2. 세션을 사용하지 않도록 설정 (제 코드에서 가져옴)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // 3. 회원가입과 로그인 경로를 모두 허용 (제 코드에서 가져옴)
                .requestMatchers("/api/user/signup", "/api/user/login").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
