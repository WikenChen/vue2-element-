<template>
<!-- 菜单导航递归组件 -->
  <div>
    <!-- 没有子级的情况 -->
    <!-- <template v-if="!routeFlag.children || routeFlag.children.length === 0">
      <el-menu-item :key="routeFlag.name" :index="routeFlag.path">
        <i :class="routeFlag.meta.icon"></i>
        <span slot="title">{{routeFlag.meta.title}}</span>
      </el-menu-item>
    </template> -->
    <!--父级菜单 有子级的情况-->
    <!-- <el-submenu v-else :index="routeFlag.path">
      <template slot="title">
        <i :class="routeFlag.meta.icon"></i>
        <span>{{routeFlag.meta.title}}</span>
      </template>

      <template v-for="child in routeFlag.children">
        <nav-menu v-if="child.children && child.children.length>0" :key="child.name" :routeFlag="child"></nav-menu>
        <el-menu-item v-else :key="child.name" :index="child.meta.parent + '/' +child.path">{{child.meta.title}}</el-menu-item>
      </template>
    </el-submenu> -->
  </div>
</template>

<script>
export default {
  name: "NavMenu",
  props: {
    routeFlag: {
      type: Object
    }
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
</style>