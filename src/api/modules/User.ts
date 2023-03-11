
// 用户登录相关
import {Http} from "@/api/Http";

export default {
    login(params: IUserLoginFormData) { // 登录请求
        return Http.post<IUserLoginFormData, IUserLoginResult>(
            '/login',
            params
        )
    },
    sendCode(params = {}) {
        return Http.post("/login/oauth/sendCode", params)
    },
    loginByCode(params = {}) {
        return Http.post("/login/oauth/loginByCode?", params)
    },
    loginByWxCode(params = {}) {
        return Http.post('/login/oauth/loginByWxCode', params)
    }

}


export interface IUserLoginFormData { // 登录参数
    username: string,
    password: string,
}


export interface IUserLoginResult extends IUserInfo { // 登录结果
    token: string
    safety: string
    refreshToken: string
}

export interface IUserInfo { // 用户信息
    id: number
    phone: string
    headImg: string
    name: string
    nickname: string
    sex: EGender
    status: number
    birthday?: string
    isTest?: boolean
}


export enum EGender { // 性别枚举
    male = "male",
    female = "female",
}

