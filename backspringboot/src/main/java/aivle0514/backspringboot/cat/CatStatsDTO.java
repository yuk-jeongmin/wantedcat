package aivle0514.backspringboot.cat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CatStatsDTO {
    private long totalCats;
    private long healthyCats;    // HealthStatus.건강
    private long attentionCats;  // HealthStatus.주의
    private double averageWeight;
}