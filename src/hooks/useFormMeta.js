import _ from "lodash"
import {reactive, readonly, ref, toRaw} from "vue";

/**
 * 表单数据处理钩子
 * @template T
 * @template R
 * @param data {T} 表单数据
 * @param rulesData {R} 表单数据
 * @param show {boolean} 表单模态框默认状态
 * @returns {{formRef: ?any, _formData: {show:boolean,data:T}, onValidate: (function(): Promise<boolean>), formData:{show:boolean,data:T},rules:R, getFormData: (function(): T), toggleModal: (function(show:boolean, row:*=): boolean)}}
 */
export function useFormMeta(data = {}, rulesData = {}, show = false) {
    const formRef = ref(null); // 表单元素HTMlElement
    // 表单数据
    const formData = reactive({
        show,
        data,
    });
    // 原始数据拷贝恢复时使用
    const _formData = readonly(_.cloneDeep(toRaw(formData)));

    const rules = reactive(rulesData)

    // 打开、关闭弹框
    const toggleModal = (show, data = {}) => {
        formData.show = _.isBoolean(show) ? show : !formData.show;
        formData.data = Object.assign({}, toRaw(_formData).data, data); // 设置表单数据
        if (formRef.value && _.isFunction(formRef.value.resetFields)) { // 重置表单的验证状态
            formRef.value.resetFields();
        }
        return formData.show;
    }

    // 表单验证
    const onValidate = () => {
        return new Promise(resolve => {
            if (formRef.value && _.isFunction(formRef.value.resetFields)) { // 重置表单的验证状态
                formRef.value.validate((valid) => {
                    resolve(valid)
                });
            } else { // 不存在表单元素无需验证
                resolve(true)
            }
        })
    }
    // 取表单数据
    const getFormData = () => {
        return _.cloneDeep(toRaw(formData)).data;
    }
    return {
        formRef,
        formData,
        _formData,
        rules,
        toggleModal,
        onValidate,
        getFormData,
    }
}
