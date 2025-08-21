import type { UserData } from '../types';

const API_BASE_URL = 'https://8080-sjleecatthe-wantedcat-7dxfzhg0f8g.ws-us121.gitpod.io';

/**
 * 로그인: Spring Security formLogin 사용 중이므로
 * - Content-Type: application/x-www-form-urlencoded
 * - credentials: 'include' 로 세션 쿠키 교환
 */
export const handleLogin = async (email: string, password: string): Promise<UserData | null> => {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: 'POST',
      credentials: 'include',                         // ★ 세션 쿠키 주고받기
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // ★ formLogin 요구사항
      },
      body: new URLSearchParams({ email, password }).toString(),
    });

    if (!resp.ok) {
      console.error('Login failed:', resp.status, resp.statusText);
      return null;
    }

    // 서버가 로그인 성공 시 텍스트만 줄 수 있으므로(“로그인 성공”),
    // 실제 사용자 정보를 얻으려면 인증이 붙은 엔드포인트를 한번 더 호출
    // (백엔드에 /api/user/me 가 없다면 건너뛰고 email만 반환)
    try {
      const me = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: 'GET',
        credentials: 'include',                       // ★ 인증 필요
      });
      if (me.ok) {
        const userData: UserData = await me.json();
        return userData;
      }
    } catch (_) {
      // /api/user/me 없거나 JSON 아님 → 아래 fallback 사용
    }

    // fallback: 최소 정보만
    return { email } as unknown as UserData;
  } catch (err) {
    console.error('An error occurred during login:', err);
    return null;
  }
};

export const handleSignup = async (userData: {
  email: string;
  username: string;
  password: string;
}): Promise<boolean> => {
  try {
    const resp = await fetch(`${API_BASE_URL}/api/user/signup`, {
      method: 'POST',
      credentials: 'include',                         // 선택(일관성 유지용)
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });

    if (resp.ok) return true;

    // 서버가 에러를 JSON으로 안 줄 수도 있으므로 방어적으로 처리
    try {
      const errJson = await resp.json();
      console.error('Signup failed:', errJson.message ?? errJson);
    } catch {
      console.error('Signup failed:', resp.status, resp.statusText);
    }
    return false;
  } catch (err) {
    console.error('An error occurred during signup:', err);
    return false;
  }
};
