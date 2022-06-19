<script setup>
import {ref, toRaw} from "vue";
import {useFormMeta} from "../../hooks/useFormMeta";
import {ElMessage} from "element-plus";
import {usePageMeta} from "../../hooks/usePageMeta";
import moment from "moment";
import Order from "../../api/modules/Order";
import {deepClone, isEmpty} from "../../utils/helpers";

// 分页请求参数hooks
const pageHelper = usePageMeta();

const tableData = ref([]); // 表格数据列表
const tableChecksData = ref([]); // 选中的表格数据列表
// 低昂单状态没去
const orderStatusEnum = {
  0: '待付款', 1: '已付款',
  2: '已取消', 3: '已完成'
}

// 打开的弹框的功能枚举
const actionTypesEnum = {
  memo: 'memo', // 添加备注
  status: 'status', // 设置状态
  batchStatus: 'batchStatus', // 批量设置状态
}
// 弹框表单数据
const formHelper = useFormMeta({
  id: 0,
  code: "",
  setMemo: true, // 设置状态|添加备注
  actionType: actionTypesEnum.memo, //打开的弹框的功能枚举： memo添加备注 status设置状态 batchStatus批量设置状态
  status: 1, // 状态 （orderStatusEnum）
  serviceMemo: "", // (备注)
});
const paramsData = ref({
  keyword: "", // 搜索关键字
  statuses: Object.keys(orderStatusEnum).map(Number), // 状态
  date: [],
});
const _paramsData = deepClone(toRaw(paramsData.value)); // 原始参数（用于重置功能）

// 重置筛选参数
const onReset = () => {
  paramsData.value = deepClone(_paramsData);
  initData(1)
}

/**
 * 获取列表数据
 * @param page {number|undefined} 页码 （undefined：当前页）
 * @returns {Promise<void>}
 */
const initData = async (page = 0) => {
  try {
    // 构建请求参数
    const params = {
      ...pageHelper.getPageMeta(page),
      ...toRaw(paramsData.value),
    };
    if (params.date && params.date.length === 2) {
      params.sTime = params.date[0];
      params.eTime = moment(params.date[0]).endOf('days').format("YYYY-MM-DD HH:mm:ss");
    }
    delete params.date

    // todo 模拟请求完成 设置列表数据
    tableData.value = [{}];

    // 设置分页参数的当前分页数和总数据条数
    pageHelper.updatePageMeta(1, 1)
  } catch (e) {
    console.log(e)
  }
};
initData();

// 表单提交处理
const onSubmit = async () => {
  try {
    const params = formHelper.getFormData();
    switch (params.actionType) {
      case actionTypesEnum.memo: // 设置备注
        if (isEmpty(params.serviceMemo)) {
          throw new Error('请填写备注');
        }
        await Order.submitServiceMemo({
          orderCode: params.code,
          serviceMemo: params.serviceMemo,
        });// 提交保存
        break;
      case actionTypesEnum.status: // 设置状态
        await Order.updateStatus({
          orderCode: params.code,
          status: params.status,
        });// 提交保存
        break;
      case actionTypesEnum.batchStatus: // 批量设置状态
        if (tableChecksData.value.length === 0) {
          formHelper.toggleModal(false);
          throw new Error("请先选择需要操作的订单")
        }
        const codes = tableChecksData.value.filter(v => v.status !== params.status).map(v => v.code)
        if (codes.length === 0) { // 当前选中的订单已经是当前状态
          break;
        }
        await Order.updateStatuses({
          orderCodes: JSON.stringify(codes),
          status: params.status,
        });// 提交保存
        break;
      default:
        throw new Error('暂不支持的操作');
    }
    ElMessage.success(`修改成功`);
    formHelper.toggleModal(false); // 关闭弹框
    initData(); // 重新加载列表数据
  } catch (e) {
    ElMessage.error(e.message)
  }
}
// 显示表单弹框
const showModal = (actionType, row = {}) => {
  if (actionType === actionTypesEnum.batchStatus && tableChecksData.value.length === 0) {
    return ElMessage.warning("请先选择需要操作的订单")
  }
  row.actionType = actionType;
  row.setMemo = actionType === actionTypesEnum.memo;

  formHelper.toggleModal(true, row);

}


</script>

<template>
  <!--状态筛选 start-->
  <div class="tw-pb-10 tw-text-14 flex-row tw-flex-wrap">
    <div class="tw-pr-10 tw-pb-5 flex-row tw-items-center">
      <div class="tw-pr-15 tw-flex-shrink-0">订单状态</div>
      <ElCheckboxGroup v-model="paramsData.statuses">
        <ElCheckbox
            :label="Number(i)"
            v-for="(item,i) of orderStatusEnum"
            :key="i" class="tw-font-400">
          {{ item }}
        </ElCheckbox>
      </ElCheckboxGroup>
    </div>
  </div>
  <!--状态筛选 end-->


  <!--其它基础筛选 start-->
  <div class="tw-pb-15 tw-font-300  tw-text-14 flex-row tw-flex-wrap">
    <div class="tw-pr-10 tw-pb-5 flex-row tw-items-center">
      <div class="tw-pr-5 tw-flex-shrink-0">搜索</div>
      <el-input style="width:200px" v-model="paramsData.keyword" placeholder="联系方式/订单号"/>
    </div>
    <div class="tw-pr-10 tw-pb-5 flex-row tw-items-center">
      <div class="tw-pr-5 tw-flex-shrink-0">创建时间</div>
      <el-date-picker
          v-model="paramsData.date"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="起始时间"
          end-placeholder="结束时间"/>
    </div>
    <ElButton @click="onReset()">重置</ElButton>
    <ElButton type="primary" @click="initData()">查询</ElButton>
  </div>
  <!--其它基础筛选 end-->

  <div class="tw-pb-10">
    <ElButton @click="showModal(actionTypesEnum.batchStatus)">批量修改状态</ElButton>
  </div>


  <!--列表 start-->
  <ElTable :max-height="500" @selection-change="v=>tableChecksData=v" :data="tableData" border>
    <el-table-column type="selection" width="55" align="center"/>
    <ElTableColumn prop="code" label="订单号" :min-width="200" align="center"></ElTableColumn>
    <ElTableColumn prop="num" label="数量" :min-width="80" align="center"></ElTableColumn>
    <ElTableColumn prop="amounts" label="总价" :min-width="100" align="center">
      <template v-slot="{row}">{{ (row.totalAmount || 0) / 100 }}元</template>
    </ElTableColumn>
    <ElTableColumn prop="status" label="状态" :min-width="80" align="center">
      <template v-slot="{row}">
        {{ orderStatusEnum[row.status] }}
      </template>
    </ElTableColumn>
    <ElTableColumn prop="linkPhone" label="联系电话" :min-width="120" align="center">
      <template v-slot="{row}">
        <span v-copy="row.linkPhone">{{ row.linkPhone }}</span>
      </template>
    </ElTableColumn>

    <ElTableColumn prop="serviceMemo" label="客服备注" :min-width="160"></ElTableColumn>
    <ElTableColumn prop="status" label="创建时间" :min-width="180" align="center">
      <template v-slot="{row}">{{ moment(row.createdTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
    </ElTableColumn>
    <ElTableColumn fixed="right" prop="action" label="操作" :min-width="160" align="center">
      <template v-slot="{row}">
        <div class="tw-select-none tw-space-x-10">
          <el-link
              class="tw-font-400"
              @click.stop="showModal(actionTypesEnum.memo, row)"
              type="primary">
            编辑备注
          </el-link>
          <el-link
              class="tw-font-400"
              @click.stop="showModal(actionTypesEnum.status, row)"
              type="primary">
            修改状态
          </el-link>
        </div>
      </template>
    </ElTableColumn>
  </ElTable>
  <!--列表 end-->

  <!--分页 start-->
  <div class="tw-py-15">
    <el-pagination
        background
        layout="prev, pager, next, total"
        @current-change="initData"
        :page-size="pageHelper.pageMeta.limit"
        :current-page="pageHelper.pageMeta.index"
        :total="pageHelper.pageMeta.count"/>
  </div>
  <!--分页 end-->


  <!--新增编辑弹框 start-->
  <el-dialog
      v-model="formHelper.formData.show"
      :title="formHelper.formData.data.setMemo?'设置备注':'设置状态'"
      width="500px">
    <el-form
        :model="formHelper.formData.data"
        label-width="120px">
      <el-form-item label="客服备注" v-if="formHelper.formData.data.setMemo">
        <el-input
            placeholder="客服备注"
            :rows="4"
            :maxlength="200"
            type="textarea"
            show-word-limit
            v-model="formHelper.formData.data.serviceMemo"/>
      </el-form-item>
      <el-form-item label="所属分类" v-else>
        <el-select
            v-model="formHelper.formData.data.status"
            placeholder="请指定状态">
          <el-option
              :label="item"
              :value="Number(i)"
              v-for="(item,i) of orderStatusEnum"
              :key="i"/>
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="formHelper.toggleModal(false)">取消</el-button>
        <el-button type="primary" @click="onSubmit">提交保存</el-button>
      </span>
    </template>
  </el-dialog>
  <!--新增编辑弹框 end-->

</template>

<style lang="less" scoped>

</style>
