package aivle0514.backspringboot.cat;
import lombok.RequiredArgsConstructor;
import aivle0514.backspringboot.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import aivle0514.backspringboot.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import lombok.Setter; // Setter 어노테이션 추가
import java.time.LocalDateTime; // LocalDateTime 클래스 추가
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
// @Slf4j
public class CatController {

    private final CatService catService;
    private final CatRepository catRepository; // CatRepository 추가 (findCatByUser, getCatStats 메서드 때문에 필요)
    private final UserRepository userRepository; // UserRepository 추가 (findCatByUser 메서드 때문에 필요)

        /**
     * 
     * @param requestCatDto 
     * @param authentication 현재 로그인된 사용자 정보
     * @return 생성된 
     */
 

    @PostMapping
    @Transactional
    public ResponseEntity<Cat> addCat(@RequestBody CatDTO.AddRequestCat requestCatDto, Authentication authentication) {
        // 현재 인증된 사용자의 이메일을 가져옵니다.
        String userEmail = authentication.getName();
        
        Cat newCat = catService.addCat(requestCatDto, userEmail);
        
        return new ResponseEntity<>(newCat, HttpStatus.CREATED);
    }

    @Transactional(readOnly = true)
    public Cat findCatByUser(Long id, String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Cat cat = catRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이를 찾을 수 없습니다."));

        // 해당 고양이가 요청한 사용자의 소유인지 확인
        if (!cat.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("권한이 없는 고양이입니다.");
        }

        return cat;
    }



    @PutMapping("/{id}")
    public ResponseEntity<Cat> updateCat(@PathVariable Long id, 
                                         @RequestBody CatDTO.UpdateRequestCat requestCatDto,
                                         Authentication authentication) {
        String userEmail = authentication.getName();
        Cat updatedCat = catService.updateCat(id, requestCatDto, userEmail);
        return ResponseEntity.ok(updatedCat);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        catService.deleteCat(id, userEmail);
        return ResponseEntity.noContent().build();
    }


    @GetMapping
    public ResponseEntity<List<Cat>> getUserCats(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Cat> cats = catService.findCatsByUser(userEmail);
        return ResponseEntity.ok(cats);
    }
 
    @GetMapping("/search")
    public ResponseEntity<List<Cat>> searchCats(@RequestParam String keyword) {
        List<Cat> result = catService.searchCats(keyword);
        return ResponseEntity.ok(result);
    }


 
    @Transactional(readOnly = true)
    public CatStatsDTO getCatStats() {
        long total = catRepository.count();
        long healthy = catRepository.countByHealthStatus(HealthStatus.healthy);
        long attention = catRepository.countByHealthStatus(HealthStatus.caution);
        Double avgWeightObj = catRepository.findAverageWeight();
        double avgWeight = (avgWeightObj == null) ? 0.0 : avgWeightObj;
        return new CatStatsDTO(total, healthy, attention, avgWeight);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cat> getCat(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Cat cat = catService.findCatByUser(id, userEmail);
        return ResponseEntity.ok(cat);
    }

}
