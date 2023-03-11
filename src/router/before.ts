import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: "登录", // 标题栏
            noToken: true, // 无需登录验证的界面
            // pageStyle:{}, // 页面默认样式
            // pageBgColor, // 页面背景色（会覆盖pageStyle的backgroundColor）

        },
        component: () => import('../views/login/Login.vue'),
    },

];

export default routes
