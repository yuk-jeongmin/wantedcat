package aivle0514.backspringboot.cat;

// import com.example.cat.domain.Cat;
// import com.example.cat.domain.HealthStatus;
// import com.example.cat.dto.CatStatsDTO;
// import com.example.cat.repository.CatRepository;
// import com.example.cat.exception.ResourceNotFoundException;
import aivle0514.backspringboot.cat.exception.CatNotFoundException;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatServiceImpl implements CatService {

    private final CatRepository catRepository;

    @Override
    public Cat insertCat(Cat cat) {
        cat.setCreatedAt(LocalDateTime.now());
        return catRepository.save(cat);
    }

    @Override
    public Cat findCat(Long id) {
        return catRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("고양이를 찾을 수 없습니다."));
    }

    @Override
    public Cat updateCat(Long id, Cat cat) {
        Cat existingCat = findCat(id);
        existingCat.setName(cat.getName());
        existingCat.setType(cat.getType());
        existingCat.setGender(cat.getGender());
        existingCat.setAge(cat.getAge());
        existingCat.setImage(cat.getImage());
        existingCat.setMemo(cat.getMemo());
        existingCat.setWeight(cat.getWeight());
        existingCat.setHealthStatus(cat.getHealthStatus()); // Enum 적용
        existingCat.setAiDataFile(cat.getAiDataFile());
        existingCat.setUpdatedAt(LocalDateTime.now());
        return catRepository.save(existingCat);
    }

    @Override
    public void deleteCat(Long id) {
        catRepository.deleteById(id);
    }

    @Override
    public List<Cat> findAllCat() {
        return catRepository.findAll();
    }

    @Override
    public List<Cat> searchCats(String keyword) {
        return catRepository.findByNameContainingOrTypeContaining(keyword, keyword);
    }

    // === 통계 메서드 ===
    @Override
    public CatStatsDTO getCatStats() {
        long total = catRepository.count();
        long healthy = catRepository.countByHealthStatus(HealthStatus.건강);
        long attention = catRepository.countByHealthStatus(HealthStatus.주의);
        Double avgWeightObj = catRepository.findAverageWeight();
        double avgWeight = (avgWeightObj == null) ? 0.0 : avgWeightObj;
        return new CatStatsDTO(total, healthy, attention, avgWeight);
    }
}
