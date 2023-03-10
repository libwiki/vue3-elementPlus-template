import {useSimpleFormMeta} from "@/hooks/useSimpleFormMeta";
import {ElMessage} from "element-plus";
import {isEmpty, isPhone} from "@/utils/helpers";
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
    const form = useSimpleFormMeta({
        username: "13188888888",
        code: "123456",
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
                // const res = await User.login(params)
                // if (!res.result) { // 登录失败
                //     throw new Error(res.message);
                // }
                const res = { // 模拟登录用户信息
                    token: params.username, // 登录用户token
                    refreshToken: params.username, // 用于刷新登录token的token
                    data:{
                        nickname: params.username, // 昵称
                    }
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
                if (isEmpty(formData.value.username)) {
                    throw new Error("请填写用户名")
                }
                if (isEmpty(formData.value.code)) {
                    throw new Error("请填写验证码")
                }
                return true
            } catch (e) {
                ElMessage.error(e.message)
                return false
            }
        },
        async sendCode(phone) {
            try {
                if (!isPhone(phone)) {
                    throw new Error('请输入正确的手机号码')
                }
                ElMessage.success("发送验证码成功");
                return true
            } catch (e) {
                ElMessage.error(e.message)
                return false
            }
        }

    }
}