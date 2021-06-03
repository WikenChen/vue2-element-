<template>
  <div class="app-wrapper">
    <section class="left-wrap" :class="[!isMenuStatus ? 'show-menu-wid' : 'hide-menu-wid']">
      <el-menu 
        class="menu-wrap"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isMenuStatus"
        :default-active="$route.path"
        router
      >
        <div class="logo">
          <h2 class="title color-white" v-if="!isMenuStatus">项目logo</h2>   
        </div>

        <template v-for="routeFlag in routes">
          <el-menu-item v-if="!routeFlag.children || routeFlag.children.length === 0" :key="routeFlag.name" :index="routeFlag.path">
            <i :class="routeFlag.meta.icon"></i>
            <span slot="title">{{routeFlag.meta.title}}</span>
          </el-menu-item>

          <el-submenu v-else :index="routeFlag.path" :key="routeFlag.name">
            <template slot="title">
              <i :class="routeFlag.meta.icon"></i>
              <span>{{routeFlag.meta.title}}</span>
            </template>
            <el-menu-item v-for="child in routeFlag.children" :key="child.name" :index="child.path">{{child.meta.title}}</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </section>
    <div class="main-container" :class="[!isMenuStatus ? 'small-main' : 'big-main']">
      <Header :username="username"/>
      <div class="content-wrap">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadlist" :key="item.path">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content-word">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getInfo }  from "@/api/login";
export default {
  components: {
    // Menu: ()=> import("@/components/menu.vue"),
    Header: ()=> import("@/components/header.vue"),
  },
  async mounted(){
    let username = localStorage.getItem('gone_user')
    let res = await getInfo({username})
    if(res.data.success){
      localStorage.setItem('gone_username', res.data.data.name)
      this.username = res.data.data.name;
    }
  },
  data(){
    return{
      username: ""
    }
  },
  methods: {
  },
  computed:{
    breadlist() {
      return this.$route.matched;
    },
    routes() {
      const route = this.$router.options.routes.filter(item=>!item.meta.noMenu)
      return route;
    },
    isMenuStatus(){
      return this.$store.state.mutations.isMenuStatus
    },
  }
}
</script>

<style lang="less" scoped>
.app-wrapper{
  height: 100vh;
  display: flex;

  .left-wrap{
    transition: width 0.28s;
    height: 100%;
    vertical-align: top;

    .menu-wrap{
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .logo{
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
  }

  .show-menu-wid{
    width: 238px !important;
  }

  .hide-menu-wid{
    width: 64px !important;
  }

  .small-main{
    width: calc(100vw - 240px) !important;
  }

  .big-main{
    width: calc(100vw - 66px) !important;
  }

  .main-container{
    background: #f0f2f5;
    transition: width 0.28s;
    vertical-align: top;
  }

  .content-wrap{
    padding: 0 10px;

    .el-breadcrumb{
      margin: 10px 0;
    }
  }

  .content-word{
    background: #fff;
    height: calc(100vh - 100px);
  }
}
</style>