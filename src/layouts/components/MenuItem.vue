<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})
</script>

<template>
  <template v-if="props.data.children&&props.data.children.length>0">
    <!--单子集菜单 start-->
    <MenuItem :data="props.data.children[0]" v-if="props.data.children.length===1"/>
    <!--单子集菜单 end-->

    <!--多个子集菜单 start-->
    <el-sub-menu :index="props.data.name" v-else>
      <template #title>
        <span v-if="props.data.meta">{{ props.data.meta.title || props.data.name }}</span>
        <span v-else>{{ props.data.name }}</span>
      </template>
      <MenuItem :data="item" :key="item.name" v-for="item of props.data.children||[]"/>
    </el-sub-menu>
    <!--多个子集菜单 start-->
  </template>


  <!--无子集菜单 start-->
  <el-menu-item :index="props.data.name" v-else>
    <template #title>
      <span v-if="props.data.meta">{{ props.data.meta.title || props.data.name }}</span>
      <span v-else>{{ props.data.name }}</span>
    </template>
  </el-menu-item>
  <!--无子集菜单 end-->

</template>

<style lang="less" scoped>

</style>
