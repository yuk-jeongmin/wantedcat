/** @type {import('tailwindcss').Config} */
module.exports = {
  // 다크 모드를 'class' 기반으로 설정합니다.
  // HTML 또는 body 태그에 'dark' 클래스를 추가하여 다크 모드를 활성화할 수 있습니다.
  darkMode: 'class',
  
  // Tailwind가 유틸리티 클래스를 스캔할 파일 경로를 지정합니다.
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // CSS 변수를 사용하여 사용자 정의 색상 팔레트를 확장합니다.
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        'input-background': 'var(--input-background)',
        'switch-background': 'var(--switch-background)',
        ring: 'var(--ring)', // --ring 변수를 Tailwind 색상으로 등록
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
        sidebar: 'var(--sidebar)',
        'sidebar-foreground': 'var(--sidebar-foreground)',
        'sidebar-primary': 'var(--sidebar-primary)',
        'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
        'sidebar-accent': 'var(--sidebar-accent)',
        'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
        'sidebar-border': 'var(--sidebar-border)',
        'sidebar-ring': 'var(--sidebar-ring)',
      },
      // CSS 변수를 사용하여 사용자 정의 테두리 반경을 확장합니다.
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // CSS 변수를 사용하여 사용자 정의 글꼴 크기를 확장합니다.
      // 원본 코드에 정의되지 않은 --text-2xl 등의 변수에 대한 기본값을 제공합니다.
      fontSize: {
        '2xl': 'var(--text-2xl, 1.5rem)', 
        xl: 'var(--text-xl, 1.25rem)',
        lg: 'var(--text-lg, 1.125rem)',
        base: 'var(--text-base, 1rem)',
      },
      // CSS 변수를 사용하여 사용자 정의 글꼴 두께를 확장합니다.
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
      },
    },
  },
  plugins: [],
};
