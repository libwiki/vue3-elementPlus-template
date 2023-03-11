import 'vue-router'
import {Emitter} from "mitt";

export {}
declare global {
    declare module '*.js';

    interface Window {
        emitter: Emitter<any>;
        _configs: any;
    }
}

// 路由元信息扩展
declare module 'vue-router' {
    interface RouteMeta {
        title?: string, // 标题栏
        noToken?: true, // 无需登录验证的界面
        pageStyle?: Partial<any>, // 页面默认样式
        pageBgColor?: string, // 页面背景色（会覆盖pageStyle的backgroundColor）
    }
}

