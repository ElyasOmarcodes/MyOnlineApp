import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // دا لاندې کرښه هم مهمه ده ترڅو ځینې کتابتونونه کریش نشي
      'process.env.NODE_ENV': JSON.stringify(mode),
      global: 'window', // د React Native ځینې کتابتونونه د global کلمې ته اړتیا لري
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'react-native': 'react-native-web',
      },
      // دا برخه ډېره مهمه ده: Vite ته وایي چې لومړی د ویب فایلونه وګوره
      extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    // دا برخه د دې لپاره ده چې د 'loader' ستونزې حل کړي
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx', // ځینې RN کتابتونونه په .js فایل کې JSX کاروي
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
