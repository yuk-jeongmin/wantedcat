package aivle0514.backspringboot.cat;

import aivle0514.backspringboot.user.User;
import aivle0514.backspringboot.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatService {

    private final CatRepository catRepository;
    private final UserRepository userRepository;

    /**
     * 새로운 고양이를 추가하는 서비스 메소드
     */
    @Transactional
    public Cat addCat(CatDto.AddRequestCat requestCatDto, String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Cat newCat = Cat.builder()
                .name(requestCatDto.getName()) 
                .breed(requestCatDto.getBreed())
                .gender(requestCatDto.getGender())
                .age(requestCatDto.getAge())
                .image(requestCatDto.getImage())
                .memo(requestCatDto.getMemo())
                .weight(requestCatDto.getWeight())
                .healthStatus(requestCatDto.getHealthStatus())
                .aiDataFile(requestCatDto.getAiDataFile())
                .user(currentUser)
                .build();
        return catRepository.save(newCat);
    }
    @Transactional(readOnly = true)
    public List<Cat> findCatsByUser(String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return catRepository.findAllByUser(currentUser);
    }

    // @param id
    // @param requestCatDto
    // @param userEmail
    // @return
    @Transactional
    public Cat updateCat(Long id, CatDto.UpdateRequestCat requestCatDto, String userEmail) {
    
        Cat cat = catRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이를 찾을 수 없습니다."));

        
        if (!cat.getUser().getEmail().equals(userEmail)) {
            // SecurityException보다는 권한 없음을 명확히 하는 사용자 정의 예외가 더 좋습니다.
            throw new IllegalStateException("고양이를 수정할 권한이 없습니다.");
        }

        
        cat.update(requestCatDto.getName(), requestCatDto.getBreed(), requestCatDto.getGender(), requestCatDto.getAge(),
        requestCatDto.getImage(),requestCatDto.getMemo(), requestCatDto.getWeight(),requestCatDto.getHealthStatus(),
        requestCatDto.getAiDataFile());
        
        // @Transactional 어노테이션의 더티 체킹 기능으로 인해 save를 호출할 필요가 없습니다.
        return cat;
    }

    // @param id
    // @param userEmail

    @Transactional
    public void deleteCat(Long id, String userEmail) {
        
        Cat cat = catRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 고양이를 찾을 수 없습니다."));
        
        // 2. 요청한 사용자가 장치의 소유주가 맞는지 확인합니다.
        if (!cat.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("고양이를 삭제할 권한이 없습니다.");
        }

        // 3. 고양를 삭제합니다.
        catRepository.delete(cat);
    }
    /**
     * 이름/품종으로 검색
     */
    @Transactional(readOnly = true)
    public List<Cat> searchCats(String keyword) {
        return catRepository.findByNameContainingOrBreedContaining(keyword, keyword);
    }

    /**
     * 통계 반환
     */
    @Transactional(readOnly = true)
    public CatStatsDto getCatStats() {
        long total = catRepository.count();
        long healthy = catRepository.countByHealthStatus(HealthStatus.healthy);
        long attention = catRepository.countByHealthStatus(HealthStatus.caution);
        Double avgWeightObj = catRepository.findAverageWeight();
        double avgWeight = (avgWeightObj == null) ? 0.0 : avgWeightObj;
        return new CatStatsDto(total, healthy, attention, avgWeight);
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

    // Cat insertCat(Cat cat);
    // Cat findCat(Long id);
    // Cat updateCat(Long id, Cat cat);
    // void deleteCat(Long id);
    // List<Cat> findAllCat();
    // List<Cat> searchCats(String keyword);

    // 추가된 통계 반환 메서드
    // CatStatsDto getCatStats();
}
