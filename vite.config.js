import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// 开发环境使用import导入 CommonJS模块导入
// import {viteCommonjs} from '@originjs/vite-plugin-commonjs'
// 在CSS和Javascript之间共享变量
import ViteCSSExportPlugin from "vite-plugin-css-export";

// Convert CommonJS modules to ES6
// https://github.com/rollup/rollup-plugin-commonjs
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';


// https://cn.vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs(),
        // viteCommonjs(),
        ViteCSSExportPlugin(),
    ],
    build: {
        brotliSize: false,
        commonjsOptions: {
            // include: [/design.config.js/], // 生产环境使用import导入 CommonJS模块导入
        }
    },
    define: {
        'process.env': {}
    },
    server: {
        // 反向代理（跨域处理）
        // proxy: {
        //     '/api': {
        //         target: 'https://api.test.com/api',
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/api/, '')
        //     },
        // },
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: path.resolve(__dirname, "./src"),
            }
        ],
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `@import "@/styles/index.less";`
            }
        }
    }
})
