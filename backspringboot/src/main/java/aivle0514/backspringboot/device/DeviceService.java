// src/main/java/aivle0514/backspringboot/device/DeviceService.java
package aivle0514.backspringboot.device;

import aivle0514.backspringboot.user.User;
import aivle0514.backspringboot.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List; // List 클래스를 사용하기 위한 import 구문

@Service
@RequiredArgsConstructor
public class DeviceService {

    // [수정] 눈에 보이지 않는 특수 공백 문자를 일반 공백으로 수정
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    @Transactional
    public Device addDevice(DeviceDto.AddRequest requestDto, String userEmail) {
        // 1. 이메일로 사용자 찾기
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 장치를 생성할 때 찾은 사용자를 함께 저장
        Device newDevice = Device.builder()
                .devicename(requestDto.getDevicename())
                .type(requestDto.getType())
                .wifiName(requestDto.getWifiName())
                .location(requestDto.getLocation())
                .user(currentUser) // 사용자 정보 추가
                .build();

        return deviceRepository.save(newDevice);
    }

    @Transactional(readOnly = true)
    public List<Device> findDevicesByUser(String userEmail) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        
        return deviceRepository.findAllByUser(currentUser);
    }
}
