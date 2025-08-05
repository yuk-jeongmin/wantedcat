import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Mail, Lock, Heart, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onGoToSignup: () => void;
}

export function LoginPage({ onLogin, onGoToSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onLogin(formData.email, formData.password);
      if (!success) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'catowner@gmail.com',
      password: 'password123'
    });
  };

  const handleAdminLogin = () => {
    setFormData({
      email: 'admin@catcommunity.com',
      password: 'admin123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-medium text-primary mb-2">캣밥바라기</h1>
          <p className="text-muted-foreground">고양이 집사들의 따뜻한 공간</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle>로그인</CardTitle>
            <p className="text-sm text-muted-foreground">계정에 로그인하여 시작하세요</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="이메일을 입력하세요"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="비밀번호를 입력하세요"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            {/* Demo Login Buttons */}
            <div className="mt-6 space-y-2">
              <div className="text-xs text-center text-muted-foreground mb-3">
                데모 계정으로 체험해보세요
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="text-xs"
                >
                  일반 사용자
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAdminLogin}
                  disabled={isLoading}
                  className="text-xs"
                >
                  관리자
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={onGoToSignup}
                  className="text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  회원가입
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © 2025 캣밥바라기. 모든 권리 보유.
          </p>
        </div>
      </div>
    </div>
  );
}