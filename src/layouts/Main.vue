<script setup>
import {ref} from 'vue'
import {ArrowDown, Avatar, Expand, Fold} from "@element-plus/icons-vue"
import cssVars from "../styles/layouts.vars.less?export"
import {isNotEmpty, isTrue, ToastConfirm} from "@/utils/helpers";
import {useRouterToMenu} from "@/hooks/useRouterToMenu";
import MenuItem from "./components/MenuItem.vue";
import {useRouter} from "vue-router";
import Configs from "../config/Configs";
import {useUserStore} from "@/store/userStore";
import {useWindowSize} from "@vant/use";
import AuthHelpers from "@/utils/AuthHelpers";

const router = useRouter();

const userStore = useUserStore()
const onLogout = async () => {
  if (!await ToastConfirm('确定退出登录吗？')) {
    return
  }
  AuthHelpers.removeUserinfo();
  // ElMessage.success('模拟退出成功')
}

// 侧边栏的展开状态
const isExpend = ref(isTrue(cssVars.asideIsExpend))

// https://vant-contrib.gitee.io/vant/#/zh-CN/use-window-size
const {width} = useWindowSize();
if (width.value < 760 && isExpend.value) { // 小屏幕默认则关闭侧边栏
  isExpend.value = false
}

// 菜单数据
const {menuData} = useRouterToMenu()
// 菜单点击跳转处理
const onMenuSelect = (name) => {
  if (isNotEmpty(name)) {
    router.push({name})

  }
}

</script>

<template>
  <div class="layout--main-container">
    <el-container>
      <el-aside :class="`el-scrollbar tw-h-screen tw-select-none transition-all el-aside ${isExpend?'expend':'fold'}`">
        <!--Logo start-->
        <div class="row-flex-center tw-px-5 logo-box">
          <!--<div class="tw-pr-5 logo-image-box">-->
          <!--  <ElImage class="tw-w-auto tw-h-full" :src="logoUrl" fit="fill"/>-->
          <!--</div>-->
          <div :class="`tw-truncate transition-all ${isExpend?'tw-w-full':'tw-w-0'}`">
            <div class="tw-text-center">
              {{ Configs.siteName }}
            </div>
          </div>
        </div>
        <!--Logo end-->

        <!--菜单栏 start-->
        <el-menu
            @select="onMenuSelect"
            :default-active="$route.name"
            class="el-menu"
            :active-text-color="cssVars.asideActiveTextColor"
            :background-color="cssVars.asideBgColor"
            :text-color="cssVars.asideTextColor"
            :collapse="!isExpend">
          <MenuItem :data="item" :key="item.name" v-for="item of menuData||[]"/>
        </el-menu>
        <!--菜单栏 end-->

      </el-aside>
      <el-container>

        <!--顶部条 start-->
        <el-header class="row-flex-center tw-justify-between tw-pl-0.5 el-header">
          <div class="tw-flex-1">
            <div @click="isExpend=!isExpend" class="tw-cursor-pointer row-flex-center expanded-box">
              <el-icon class="tw-text-22 tw-text-gray-600">
                <Fold v-if="isExpend"/>
                <Expand v-else/>
              </el-icon>
            </div>
          </div>
          <div>
            <el-dropdown>
              <div class="row-flex-center tw-cursor-pointer">
                <div class="tw-border tw-px-2 tw-py-2 tw-mr-5 tw-rounded-full">
                  <el-icon class="tw-text-22">
                    <Avatar/>
                  </el-icon>
                </div>
                <div class="tw-pr-5">{{ userStore.userinfo.info.nickname }}</div>
                <el-icon class="tw-text-16">
                  <ArrowDown/>
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click.stop="onLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <!--顶部条 end-->

        <!--公共内容区域 start-->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!--公共内容区域 end-->

      </el-container>
    </el-container>

  </div>
</template>

<style lang="less" scoped>
.layout--main-container {
  .el-header {
    position: sticky;
    top: 0;
    z-index: 999;
    border-bottom: solid 1px #eee;
    background-color: @headerBgColor;
    height: @headerHeight;

    .expanded-box {
      width: @headerHeight;
      height: @headerHeight;
    }
  }

  .logo-box {
    height: @headerHeight;
    background-color: @asideBgColor;
    color: @asideTextColor;

    .logo-image-box {
      width: auto;
      height: 40%;
    }
  }

  .el-aside {
    width: @asideMinWidth;
    position: sticky;
    top: 0;
    overflow-x: hidden;
    overflow-y: auto;

    &.expend {
      width: @asideMaxWidth;
    }


    .el-menu {
      overflow-x: hidden;
      border-right: none;
      height: calc(100% - @headerHeight);

      &:not(.el-menu--collapse) {
        width: @asideMaxWidth;
      }
    }

  }

}


</style>
