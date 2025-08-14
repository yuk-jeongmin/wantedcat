package aivle0514.backspringboot.cat;

// import com.example.cat.domain.Cat;
// import com.example.cat.domain.HealthStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatRepository extends JpaRepository<Cat, Long> {
    List<Cat> findByNameContainingOrTypeContaining(String name, String type);

    // HealthStatus별 카운트
    long countByHealthStatus(HealthStatus status);

    // 평균 체중 (null 가능)
    @Query("SELECT AVG(c.weight) FROM Cat c")
    Double findAverageWeight();
}
