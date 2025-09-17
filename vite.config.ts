import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.GITHUB_PAGES ? 'REPOSITORY_NAME' : './',
    build: {
        target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
        outDir: './dist/',
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },
});
