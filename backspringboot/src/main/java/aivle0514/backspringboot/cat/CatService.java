package aivle0514.backspringboot.cat;

// import com.example.cat.domain.Cat;
// import com.example.cat.dto.CatStatsDTO;

import java.util.List;

public interface CatService {
    Cat insertCat(Cat cat);
    Cat findCat(Long id);
    Cat updateCat(Long id, Cat cat);
    void deleteCat(Long id);
    List<Cat> findAllCat();
    List<Cat> searchCats(String keyword);

    // 추가된 통계 반환 메서드
    CatStatsDTO getCatStats();
}
