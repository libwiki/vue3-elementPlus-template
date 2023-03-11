<script lang="ts" setup>
import {Ticket, UserFilled} from "@element-plus/icons-vue"
import {useCountDown} from "@/hooks/useCountDown";
import {useLogin} from "@/views/login/useLogin";

const loginHelper = useLogin();
const countDownHelper = useCountDown();
countDownHelper.recover(); // 保证用户刷新页面时恢复倒计时
// 发送短信验证码
const onSendCode = async () => {
  if (countDownHelper.data.value > 0) { // 倒计时内禁止频繁发送短信
    return;
  }
  const success = await loginHelper.sendCode(loginHelper.formData.value.username)
  if (success) { // 启动一个60s的倒计时
    countDownHelper.start(60)
  }

}


</script>

<template>
  <div class="tw-w-full tw-h-screen row-flex-center">
    <div class="tw-bg-white tw-border tw-py-25 tw-px-25 tw-shadow tw-rounded-5">
      <div class="tw-text-center tw-text-18 tw-pb-20">管理员登录</div>
      <el-form :model="loginHelper.formData">
        <el-form-item label="">
          <el-input maxlength="11" type="tel" placeholder="请输入任意的手机号" v-model="loginHelper.formData.value.username">
            <template #prefix>
              <el-icon>
                <UserFilled/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="flex-row tw-items-center">
            <el-input maxlength="6" type="number" placeholder="任意的验证码" v-model="loginHelper.formData.value.code">
              <template #prefix>
                <el-icon>
                  <Ticket/>
                </el-icon>
              </template>
            </el-input>
            <el-button
                :disabled="countDownHelper.data.value > 0"
                @click="onSendCode"
                class="tw-text-12 tw-ml-10 send-code-btn"
                type="primary">
              {{ countDownHelper.data.value > 0 ? `${countDownHelper.data.value}s后重新获取` : "发送验证码" }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="row-flex-center tw-py-25">
        <el-button
            @click="loginHelper.login()"
            class="tw-w-full" size="large" type="primary">
          立即登录
        </el-button>
      </div>

    </div>
  </div>
</template>

<style lang="less" scoped>
.send-code-btn {
  width: 120px;
  flex-shrink: 0;
}
</style>
