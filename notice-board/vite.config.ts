import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const gitpodUrl = process.env.GITPOD_WORKSPACE_URL?.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                 // 내부는 0.0.0.0:5173
    port: 5173,
    allowedHosts: [".gitpod.io"],

    // 🔽 HMR 설정 (서버는 그대로 5173, 브라우저에게만 443 사용 통보)
    hmr: {
      protocol: "wss",
      host: gitpodUrl,          // 예) 5173-sjlee....gitpod.io
      clientPort: 443           // ✔️ 브라우저가 443으로 접속
      // 'port' 는 지정하지 말 것!
    }
  }
});
