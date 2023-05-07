import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          icon: true,
        },
      }),
      crx({ manifest }),
    ],
    build: {
      // dont minify the code
      minify: false,
      sourcemap: mode === 'development',
    },
    resolve: {
      alias: {
        src: '/src',
        '~/src': '/src',
        '~/contexts': '/src/contexts',
        '~/components': '/src/components',
        '~/stores': '/src/stores',
        '~/shared': '/src/shared',
        '~/assets': '/src/assets',
        '~/utils': '/src/utils',
        '~/backgroundScripts': '/src/backgroundScripts',
        '~/db': '/src/db',
        '~/lib': '/src/lib',
        '~/contentScript': '/src/contentScript',
        '~/config': '/src/config',
        '~/parsers': '/src/contentScript/parsers',
      },
    },
  });
};
