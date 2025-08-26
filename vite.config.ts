import { defineConfig } from 'vite';

export default defineConfig({
    root: './', // index.html 위치 폴더 지정 (필요시)
    // server: {
    //   port: 3000,      // 개발 서버 포트 지정 (선택사항)
    //   open: true       // 서버 실행 시 자동으로 브라우저 열기
    // },
    build: {
        outDir: './dist', // 빌드 결과물 위치 (index.html 폴더 기준 상대경로)
    },
    server: {
        proxy: {
            '/market': {
                target: 'http://localhost:8888',
                changeOrigin: true,
            },
        },
        port: 3000,
        open: false,
    },
});
