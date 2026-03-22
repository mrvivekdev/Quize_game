import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
   allowedHosts: [
      'mandatory-journalist-sunshine-noon.trycloudflare.com',
      "https://quize-game-h03k.onrender.com/",
    ],
    proxy: {
      "/api": {
        target: "http://localhost:4545",
        changeOrigin: true,
        secure: false
      }
    }
  }
})