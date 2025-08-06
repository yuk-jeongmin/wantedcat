import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isGitpod = !!process.env.GITPOD_WORKSPACE_URL;
const gitpodHost = process.env.GITPOD_WORKSPACE_URL
  ?.replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,

    // 상황별로 필요한 설정만 전개(…)
    ...(isGitpod
        ? {
            allowedHosts: [".gitpod.io"],
            hmr: {
              protocol: "wss",
              host: gitpodHost,   // ex) sjlee….gitpod.io
              clientPort: 5173,    // Gitpod에서는 443이 안전
            },
          }
        : {
            // 로컬 개발용 HMR
            hmr: {
              protocol: "ws",
              host: "localhost",
              port: 5173,
            },
          }),
  },

});
