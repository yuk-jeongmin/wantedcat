// src/main/java/aivle0514/backspringboot/device/DeviceRepository.java
package aivle0514.backspringboot.device;
import aivle0514.backspringboot.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findAllByUser(User user);
}