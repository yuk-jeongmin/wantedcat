export default function App() {
  return (
    // 이 한 줄이 핵심입니다!
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-blue-600 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">TailwindCSS Test</h1>
        <p className="text-lg">
          만약 이 박스가 파란색 배경에 흰색 텍스트라면 성공입니다!
        </p>
      </div>
    </div>
  );
}
