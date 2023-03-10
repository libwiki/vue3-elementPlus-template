import {createApp} from 'vue'
import App from './App.vue'
import "nprogress/nprogress.css"
import "./styles/preflight.css"
import 'element-plus/dist/index.css'
import ElementPlus, {ElMessage} from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import router from "./router";
import mitt from "mitt";
import {createPinia} from "pinia";
import "./styles/tailwind.index.css"
import VueClipboard from "./directives/clipboard.js"
// 简单事件处理
// 文档参考：https://github.com/developit/mitt
window.emitter = mitt();

const app = createApp(App)
app.use(router); // 使用 路由 文档参考：https://next.router.vuejs.org/zh/introduction.html
app.use(VueClipboard, {
    success() {
        ElMessage.success("复制成功")
    },
    error() {
        ElMessage.warning("复制失败")
    }
})
// app.use(ElementPlus, {size: 'small', zIndex: 3000})
app.use(ElementPlus, {locale})
app.use(createPinia()); // 状态管理器 文档参考：https://pinia.web3doc.top/
app.mount('#app')
