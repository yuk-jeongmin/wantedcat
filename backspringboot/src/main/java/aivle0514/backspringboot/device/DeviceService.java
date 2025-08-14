package aivle0514.backspringboot.device;

import aivle0514.backspringboot.user.User;
import aivle0514.backspringboot.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    /**
     * 새로운 장치를 추가하는 서비스 메소드
     */
    @Transactional
    public Device addDevice(DeviceDto.AddRequest requestDto, String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Device newDevice = Device.builder()
                .devicename(requestDto.getDevicename()) // devicename -> name으로 통일하는 것이 좋습니다.
                .type(requestDto.getType())
                .wifiName(requestDto.getWifiName())
                .location(requestDto.getLocation())
                .user(currentUser)
                .build();

        return deviceRepository.save(newDevice);
    }

    /**
     * 특정 사용자의 모든 장치를 조회하는 서비스 메소드
     */
    @Transactional(readOnly = true)
    public List<Device> findDevicesByUser(String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return deviceRepository.findAllByUser(currentUser);
    }

    /**
     * [추가] 장치 정보를 수정하는 서비스 메소드
     * @param deviceId 수정할 장치의 ID
     * @param requestDto 수정할 정보가 담긴 DTO
     * @param userEmail 요청한 사용자의 이메일
     * @return 수정된 장치 정보
     */
    @Transactional
    public Device updateDevice(Long deviceId, DeviceDto.UpdateRequest requestDto, String userEmail) {
        // 1. 장치 ID로 장치를 찾습니다. 없으면 예외를 발생시킵니다.
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 장치를 찾을 수 없습니다."));

        // 2. 요청한 사용자가 장치의 소유주가 맞는지 확인합니다.
        if (!device.getUser().getEmail().equals(userEmail)) {
            // SecurityException보다는 권한 없음을 명확히 하는 사용자 정의 예외가 더 좋습니다.
            throw new IllegalStateException("장치를 수정할 권한이 없습니다.");
        }

        // 3. DTO로부터 받은 정보로 장치 내용을 업데이트합니다.
        device.update(requestDto.getDevicename(), requestDto.getType(), requestDto.getWifiName(), requestDto.getLocation());
        
        // @Transactional 어노테이션의 더티 체킹 기능으로 인해 save를 호출할 필요가 없습니다.
        return device;
    }

    /**
     * [추가] 장치를 삭제하는 서비스 메소드
     * @param deviceId 삭제할 장치의 ID
     * @param userEmail 요청한 사용자의 이메일
     */
    @Transactional
    public void deleteDevice(Long deviceId, String userEmail) {
        // 1. 장치 ID로 장치를 찾습니다.
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 장치를 찾을 수 없습니다."));
        
        // 2. 요청한 사용자가 장치의 소유주가 맞는지 확인합니다.
        if (!device.getUser().getEmail().equals(userEmail)) {
            throw new IllegalStateException("장치를 삭제할 권한이 없습니다.");
        }

        // 3. 장치를 삭제합니다.
        deviceRepository.delete(device);
    }
}