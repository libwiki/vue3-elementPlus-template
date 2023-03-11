import {Http} from "../Http";

// 订单管理 以下接口截取至项目（暂时使用）
export default {
    // 提交客服备注
    submitServiceMemo(params = {}) {
        return Http.post("/order/submitServiceMemo", params)
    },
    // 修改状态
    updateStatus(params = {}) {
        return Http.post("/order/updateStatus", params)
    },
    // 批量修改状态
    updateStatuses(params = {}) {
        return Http.post("/order/updateStatuses" + params)
    },

}
