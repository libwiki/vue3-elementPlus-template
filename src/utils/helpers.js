import _ from "lodash"
import CryptoJS from "crypto-js"
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

export function isPhone(value) {
    return /^1\d{10}$/.test(value);
}

export function isNotEmpty(value) {
    return !isEmpty(value)
}

// 判断数据是否为空
export function isEmpty(value) {
    if (_.isUndefined(value) || _.isNull(value)) {
        return true;
    }
    if (_.isString(value) && value.trim(value).length === 0) {
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

export function isFalse(value) {
    return !isTrue(value)
}

// 是否为true  0、'0'、false、'false'、为false
export function isTrue(value) {
    if (_.isBoolean(value)) {
        return value;
    } else if (_.isNull(value)) {
        return false;
    } else if (isNumeric(value)) {
        return Number(value) !== 0;
    } else if (_.isString(value)) {
        return value === 'true';
    }

    return false;
}


// 是否是number 或者 字符串形式的number  123、'123'均返回true
export function isNumeric(value) {
    return _.isNumber(Number(value));
}

export function aesEncrypt(key, data) {
    const k = CryptoJS.enc.Utf8.parse(key);//16位
    const iv = CryptoJS.enc.Utf8.parse(key);
    const srcs = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(srcs, k, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function aesDecrypt(key, data) {
    const k = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse(key);
    const encryptedHexStr = CryptoJS.enc.Base64.parse(data);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, k, {
        iv,
        mode: CryptoJS.mode.CBC
    });
    return decrypt.toString(CryptoJS.enc.Utf8).toString();
}
