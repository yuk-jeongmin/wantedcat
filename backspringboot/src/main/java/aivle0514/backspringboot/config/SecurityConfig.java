package aivle0514.backspringboot.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  // ✅ API 전용 체인: /api/** 만 매칭 (리다이렉트/세션/폼로그인 영향 제거)
  @Bean
    @Order(0)
    SecurityFilterChain apiChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/**", "/actuator/**") // actuator도 같이 매칭
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/user/signup").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }

  // (선택) /api 이외 요청은 개발 중 전부 허용 (원하면 삭제 가능)
  @Bean
  @Order(1)
  public SecurityFilterChain webChain(HttpSecurity http) throws Exception {
    http
      .cors(c -> c.configurationSource(corsConfigurationSource()))
      .csrf(AbstractHttpConfigurer::disable)
      .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration c = new CorsConfiguration();
    c.setAllowedOriginPatterns(List.of("https://*.gitpod.io"));
    c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
    c.setAllowedHeaders(List.of("*"));
    c.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
    s.registerCorsConfiguration("/**", c);
    return s;
  }

  @Bean
  public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}
