import _ from "lodash"
import {ElMessageBox} from "element-plus";

export function canSetParams(method = 'get') {
    return ['get', 'delete', 'head'].includes(method.toLowerCase())
}


// 确认操作弹框
export async function ToastConfirm(content = "确定删除吗？", title = '确认提示') {
    try {
        await ElMessageBox.confirm(content, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            draggable: true,
        });
        return true
    } catch (e) {
        return false
    }
}

export function isPhone(value:string) {
    return /^1\d{10}$/.test(value);
}

export function isNotEmpty(value:any) {
    return !isEmpty(value)
}

// 判断数据是否为空
export function isEmpty(value:any) {
    if (_.isUndefined(value) || _.isNull(value)) {
        return true;
    }
    if (_.isString(value) && value.trim().length === 0) {
        return true;
    }
    if (_.isArray(value) && value.length === 0) {
        return true;
    }
    if (_.isObject(value) && Object.values(value).length === 0 && !(value instanceof Date)) {
        return true;
    }
    if (_.isObject(value) && value instanceof Date && !value) {
        return true;
    }
    return false;
}

export function isFalse(value:any) {
    return !isTrue(value)
}

// 是否为true  0、'0'、false、'false'、为false
export function isTrue(value:any) {
    if (_.isBoolean(value)) {
        return value;
    } else if (_.isNull(value) || _.isUndefined(value)) {
        return false;
    } else if (isNumeric(value)) {
        return Number(value) !== 0;
    } else if (_.isString(value)) {
        return value === 'true';
    }

    return false;
}


// 是否是number 或者 字符串形式的number  123、'123'均返回true
export function isNumeric(value:any) {
    return _.isNumber(Number(value));
}
