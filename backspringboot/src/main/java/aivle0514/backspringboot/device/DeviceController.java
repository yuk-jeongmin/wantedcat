package aivle0514.backspringboot.device;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    /**
     * 새로운 장치를 추가하는 API
     * @param requestDto 장치 정보 Dto
     * @param authentication 현재 로그인된 사용자 정보
     * @return 생성된 장치 정보
     */
    @PostMapping
    public ResponseEntity<Device> addDevice(@RequestBody DeviceDto.AddRequest requestDto, Authentication authentication) {
        // 현재 인증된 사용자의 이메일을 가져옵니다.
        String userEmail = authentication.getName();
        
        // DeviceService를 호출하여 장치를 추가하고, 생성된 장치를 반환받습니다.
        Device newDevice = deviceService.addDevice(requestDto, userEmail);
        
        // 성공적으로 생성되었음을 알리는 201 Created 상태와 함께 장치 정보를 응답합니다.
        return new ResponseEntity<>(newDevice, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Device>> getUserDevices(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Device> devices = deviceService.findDevicesByUser(userEmail);
        return ResponseEntity.ok(devices);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable Long id, 
                                               @RequestBody DeviceDto.UpdateRequest requestDto, 
                                               Authentication authentication) {
        String userEmail = authentication.getName();
        Device updatedDevice = deviceService.updateDevice(id, requestDto, userEmail);
        return ResponseEntity.ok(updatedDevice);
    }

    /**
     * [추가] 특정 장치를 삭제하는 API
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        deviceService.deleteDevice(id, userEmail);
        // 장치가 없거나 권한이 없는 경우 Service 레이어에서 예외 처리를 가정합니다.
        return ResponseEntity.noContent().build(); // 성공적으로 처리되었으나 본문 내용 없음 (204 No Content)
    }

    
}
