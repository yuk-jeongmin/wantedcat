package aivle0514.backspringboot.config; // 💡 이 패키지 경로는 실제 프로젝트 위치에 맞게 수정해주세요.

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // "/api/"로 시작하는 모든 요청에 대해 CORS 정책을 적용합니다.

        // ✅ [가장 중요] 여기에 오류 메시지에 나온 프론트엔드 주소를 정확히 적어주세요.
        .allowedOrigins("https://5174-sjleecatthe-wantedcat-7dxfzhg0f8g.ws-us120.gitpod.io")
        
        // 허용할 HTTP 요청 메서드를 지정합니다. (GET, POST 등)
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        
        // 허용할 요청 헤더를 지정합니다. ("*"는 모든 헤더를 허용)
        .allowedHeaders("*")
        
        // 쿠키와 같은 인증 정보를 요청에 포함할 수 있도록 허용합니다.
        .allowCredentials(true);
}


}