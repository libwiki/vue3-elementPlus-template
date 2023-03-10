import {useSimpleFormMeta} from "@/hooks/useSimpleFormMeta";
import {ElMessage} from "element-plus";
import {isEmpty} from "@/utils/helpers";
import User from "@/api/modules/User";
import {useRouter} from "vue-router";
import Configs from "@/config/Configs";
import AuthHelpers from "@/utils/AuthHelpers";


/**
 * 登录功能合集
 * 逻辑与页面分离主要是为了减少 ./Login.vue文件的大小
 * 如果逻辑很少也可直接写在./Login.vue中，此处做个样例参考
 * 假设./Login.vue页面同时包含登录、注册功能，则可将注册逻辑另外剖开成另一个合集，每个页面的功能越少，后续维护越方便，则也可创建文件，目录如下
 *
 * src/login{ // 登录、注册页面
 *     hooks{ // 这是逻辑分离文件夹
 *         useLogin.ts
 *         useRegister.ts
 *     }
 *     kits{ // 这是页面组件更细化的分离(如果页面过大，则此文件夹为当前登录、注册页面功能独有的组件分块)
 *         Login.vue
 *         Register.vue
 *     }
 *     Index.vue
 * }
 */
export function useLogin() {
    const form = useSimpleFormMeta<IUserLoginFormData>({
        principal: "system",
        password: "111111",
        captcha: "",
    });
    const router = useRouter();


    const formData = form.formData;
    return {
        form,
        formData,
        // 登录提交
        async login() {
            try {
                if (!this.check()) { // 表单验证
                    return
                }
                const params = form.getFormData();
                const res = await User.login(params)
                if (!res.result) { // 登录失败
                    throw new Error(res.message);
                }
                // 存贮用户登录信息
                AuthHelpers.setToken(res.data.token);
                AuthHelpers.setRefreshToken(res.data.refreshToken);
                AuthHelpers.setUserinfo(res.data);
                AuthHelpers.syncUserinfo(false); // 同步用户信息到store中

                ElMessage.success(`${res.data.nickname}！欢迎~`); // 展示欢迎词
                return router.replace({name: Configs.homeRouteName}); // 跳转登录页面
            } catch (e) {
                ElMessage.error(e.message)
            }
        },

        // 表单检测
        check() {
            try {
                if (isEmpty(formData.value.principal)) {
                    throw new Error("请填写用户名")
                }
                if (isEmpty(formData.value.password)) {
                    throw new Error("请填写密码")
                }
                if (isEmpty(formData.value.captcha)) {
                    throw new Error("请填写验证码")
                }
                return true
            } catch (e) {
                ElMessage.error(e.message)
                return false
            }
        },

    }
}