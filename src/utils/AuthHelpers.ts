import {useUserStore} from "@/store/userStore";
import router from "@/router";
import Configs from "@/config/Configs";
import {ToastConfirm} from "@/utils/helpers";
import {IUserInfo} from "@/api/modules/User";

const tokenKey = "store_auth_token_key"
const refreshTokenKey = "store_auth_refresh_token_key"
const userinfoKey = "store_auth_userinfo_key"
export default {

    getToken() {
        return localStorage.getItem(tokenKey)
    },
    setToken(value: string) {
        localStorage.setItem(tokenKey, value)
    },
    getRefreshToken() {
        return localStorage.getItem(refreshTokenKey)
    },
    setRefreshToken(value: string) {
        localStorage.setItem(refreshTokenKey, value)
    },
    getUserinfo(): IUserInfo | null {
        try {
            return JSON.parse(localStorage.getItem(userinfoKey) || "") || null;
        } catch (e) {
            return null
        }
    },
    setUserinfo(value: IUserInfo) {
        localStorage.setItem(userinfoKey, JSON.stringify(value));
    },
    syncUserinfo(isRefresh = false) { // 同步用户信息到store中
        const info = this.getUserinfo();
        const token = this.getToken();
        const refreshToken = this.getRefreshToken();
        const userStore = useUserStore();
        info && userStore.setUserinfo(info);
        token && userStore.setToken(token);
        refreshToken && userStore.setRefreshToken(refreshToken);
    },
    async removeUserinfo(isReplace = true, showConfirm = false) {
        if (showConfirm) {
            const can = await ToastConfirm("确定退出登录吗?")
            if (!can) {
                return
            }
        }
        localStorage.clear();
        if (isReplace) {
            await router.replace({name: Configs.loginRouteName})
        }
    }
}