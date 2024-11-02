import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: 'prompt',
  //outDir: 'dist/assets',
  includeAssests: ['favicon.ico', "logo192.png", "masked-icon.svg"],
  manifestFilename: "assets/manifest.webmanifest",
  FILE_SW_REGISTER: "assets/registerSW.js",
  filename: "assets/sw.js",
  manifest: {
    name: "DIYHue Webapp",
    short_name: "DIYHue",
    description: "Fully configurable diyHue Emulator",
    icons: [{
      src: '/assets/images/favicon.ico',
      sizes: '64x64',
      type: 'image/x-icon',
    },
    {
      src: '/assets/images/logo192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/assets/images/logo512.png',
      sizes: '512x512',
      type: 'image/png',
    }
    ],
    screenshots: [
      {
        src: "/assets/images/screenshot_desktop.webp",
        sizes: "2556x1238",
        type: "image/webp",
        form_factor: "wide",
        label: "DIYHue App"
      },
      {
        src: "/assets/images/screenshot_mobile.webp",
        sizes: "1179x2379",
        type: "image/webp",
        form_factor: "narrow",
        label: "DIYHue App"
      }
    ],
    theme_color: '#000000',
    background_color: '#000000',
    display: "standalone",
    scope: '/',
    start_url: "/",
    id: "/",
    orientation: 'portrait'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), VitePWA(manifestForPlugIn)],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  }
})
