import {defineStore} from "pinia";
import {reactive} from "vue";
import AuthHelpers from "@/utils/AuthHelpers";

// 用户登录信息

export const useUserStore = defineStore("userInfo", () => {
    const userinfo = reactive({
        token: "",
        refreshToken: "",
        info: {
            id: 0,
            phone: "",
            headImg: "",
            name: "",
            nickname: "",
            email: "",
            sex: 'male',
            status: 1,
        }
    });


    return {
        userinfo,
        isLogin() {
            return userinfo.token.length > 0 || AuthHelpers.getToken()
        },
        setToken(token) {
            userinfo.token = token;
        },
        setRefreshToken(token) {
            userinfo.refreshToken = token;
        },
        setUserinfo(data) {
            userinfo.info = data;
        }
    }
});
