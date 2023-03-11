import Main from "../layouts/Main.vue"
import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] =  [
    {
        path: '/',
        name: '/',
        component: Main,
        redirect: "/home",
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    title: "首页", // 标题栏
                    // noToken: true, // 无需登录验证的界面
                    // pageStyle:{}, // 页面默认样式
                    // pageBgColor, // 页面背景色（会覆盖pageStyle的backgroundColor）

                },
                component: () => import('../views/Home.vue'),
            },

        ],
    },
    {
        path: '/order_manager',
        name: 'order_manager',
        component: Main,
        meta: {
            title: "订单管理", // 标题栏
        },
        redirect: "/orders",
        children: [
            {
                path: '/orders',
                name: 'orders',
                meta: {
                    title: "订单列表", // 标题栏

                },
                component: () => import('../views/order/Orders.vue'),
            },
            {
                path: '/otherOrders',
                name: 'otherOrders',
                meta: {
                    title: "其它页面", // 标题栏

                },
                component: () => import('../views/order/OtherOrders.vue'),
            },
        ],
    },


];

export default routes
