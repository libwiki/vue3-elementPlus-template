<script setup>
import {useUserLogin} from "./hooks/user/useUserLogin";

useUserLogin().initUserInfo(false); // 初始化登录用户的信息到store中
</script>

<template>
  <el-config-provider>
    <!--组局库全局配置参考-->
    <!--https://element-plus.gitee.io/zh-CN/component/config-provider.html-->
    <router-view></router-view>
  </el-config-provider>
</template>

<style lang="less" scoped>

</style>
