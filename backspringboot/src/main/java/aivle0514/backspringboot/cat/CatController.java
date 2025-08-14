package aivle0514.backspringboot.cat;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
// import com.example.cat.domain.Cat;
// import com.example.cat.dto.CatStatsDTO;
// import com.example.cat.service.CatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
public class CatController {

    private final CatService catService;

    // 등록
    @PostMapping
    public Cat createCat(@RequestBody Cat cat) {
        return catService.insertCat(cat);
    }

    // 단일 조회
    @GetMapping("/{id}")
    public Cat findCat(@PathVariable Long id) {
        return catService.findCat(id);
    }

    // 수정
    @PutMapping("/{id}")
    public Cat updateCat(@PathVariable Long id, @RequestBody Cat cat) {
        return catService.updateCat(id, cat);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public String deleteCat(@PathVariable Long id) {
        catService.deleteCat(id);
        return "고양이 삭제 성공!";
    }

    // 전체 조회
    @GetMapping
    public List<Cat> findAllCat() {
        return catService.findAllCat();
    }

    // 검색 (이름, 품종)
    @GetMapping("/search")
    public List<Cat> searchCats(@RequestParam String keyword) {
        return catService.searchCats(keyword);
    }

    // === 통계 엔드포인트 ===
    @GetMapping("/stats")
    public CatStatsDTO getCatStats() {
        return catService.getCatStats();
    }
}
