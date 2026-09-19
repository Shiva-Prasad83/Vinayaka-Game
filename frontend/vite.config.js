import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load .env.local / .env so we can read VITE_API_URL even at config time
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    // ── Dev server ──────────────────────────────────────────────────────
    server: {
      port: 5173,
      proxy: {
        // Only used in development — Vercel production uses VITE_API_URL directly
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', () => {
              // Backend offline — game falls back to localStorage automatically
            });
          },
        },
      },
    },

    // ── Build ────────────────────────────────────────────────────────────
    build: {
      target: 'esnext',
      // Suppress the "chunk > 500 kB" advisory — expected for Three.js games
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // Vite 8 (rolldown) requires manualChunks to be a function, not an object
          manualChunks: (id) => {
            if (id.includes('node_modules/three') ||
              id.includes('node_modules/@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/zustand')) {
              return 'state-vendor';
            }
          },
        },
      },
    },

    // ── Pre-bundle these heavy deps so dev server starts fast ────────────
    optimizeDeps: {
      include: ['three', '@react-three/fiber', '@react-three/drei'],
    },
  };
});
