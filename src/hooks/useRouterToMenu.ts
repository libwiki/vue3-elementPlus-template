import {reactive} from "vue";
import v1 from "../router/v1";

// 路由文件转换为菜单文件钩子
export function useRouterToMenu() {
    const menuData=reactive(v1); // 直接使用前端配置的路由作为菜单

    return {menuData}
}
