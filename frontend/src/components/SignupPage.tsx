import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Mail, Lock, User, Heart, AlertCircle, CheckCircle } from "lucide-react";

interface SignupPageProps {
  onSignup: (userData: {
    email: string;
    username: string;
    password: string;
  }) => Promise<{ success: boolean; message?: string }>;
  onGoToLogin: () => void;
}

export function SignupPage({ onSignup, onGoToLogin }: SignupPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.email.trim()) {
      return '이메일을 입력해주세요.';
    }
    if (!formData.email.includes('@')) {
      return '유효한 이메일 주소를 입력해주세요.';
    }
    if (!formData.username.trim()) {
      return '이름을 입력해주세요.';
    }
    if (formData.username.trim().length < 2) {
      return '이름은 2글자 이상 입력해주세요.';
    }
    if (!formData.password.trim()) {
      return '비밀번호를 입력해주세요.';
    }
    if (formData.password.length < 6) {
      return '비밀번호는 6글자 이상 입력해주세요.';
    }
    if (formData.password !== formData.confirmPassword) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await onSignup({
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password
      });
      
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onGoToLogin();
        }, 3000);
      } else {
        setError('이미 존재하는 이메일입니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }

    setIsLoading(false);
  };


  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-medium mb-2">회원가입 완료!</h2>
            <p className="text-muted-foreground mb-4">
              환영합니다! 계정이 성공적으로 생성되었습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              잠시 후 로그인 페이지로 이동합니다...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-medium text-primary mb-2">캣밥바라기</h1>
          <p className="text-muted-foreground">새로운 집사님, 환영합니다!</p>
        </div>

        {/* Signup Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle>회원가입</CardTitle>
            <p className="text-sm text-muted-foreground">계정을 만들어 시작하세요</p>
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
                <Label htmlFor="email">이메일 *</Label>
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
                <Label htmlFor="name">이름 *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="이름을 입력하세요"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="비밀번호를 입력하세요 (6자 이상)"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="비밀번호를 다시 입력하세요"
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
                {isLoading ? '계정 생성 중...' : '계정 만들기'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={onGoToLogin}
                  className="text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  로그인
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