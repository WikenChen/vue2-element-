<template>
  <div class="app-wrapper">
    <section class="left-wrap" :class="[!isMenuStatus ? 'show-menu-wid' : 'hide-menu-wid']">
      <el-menu 
        class="menu-wrap"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#fff"
        :collapse="isMenuStatus"
        :default-active="$route.path"
        router
      >
        <div class="logo">
          <h2 class="title color-white" v-if="!isMenuStatus">项目名称</h2>   
        </div>
        <sidebar-item :menu="routes" />
      </el-menu>
    </section>
    <div class="main-container" :class="[!isMenuStatus ? 'small-main' : 'big-main']">
      <Header :username="username"/>
        <!-- 面包屑 -->
        <!-- <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadlist" :key="item.path">{{item.meta.title}}</el-breadcrumb-item>
        </el-breadcrumb> -->
        <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="tabClick" class="content-wrap">
          <el-tab-pane 
            v-for="item in tabsItem"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            :closable="item.closable">
          </el-tab-pane>
        </el-tabs>

        <div class="content-word">
          <keep-alive :include="keepAliveRoute">
            <router-view />
          </keep-alive>
        </div>
    </div>
  </div>
</template>

<script>
import { getInfo }  from "@/api/login";
export default {
  components: {
    SidebarItem: ()=> import("@/components/menu.vue"),
    Header: ()=> import("@/components/header.vue"),
  },
  async created(){
    // let username = localStorage.getItem('projectxx_user')
    // let res = await getInfo({username})
    // if(res.data.success){
    //   localStorage.setItem('projectxx_userInfo', JSON.stringify(res.data.data))
    //   this.username = res.data.data.name;
    // }
    this.triggerTab(this.$route)
  },
  data(){
    return{
      // username: "xxx",

      activeTab: '/dashboard', //默认显示的tab
      tabsItem: [
        {
          title: '首页',
          name: '/dashboard',
          comName: 'dashboard',
          closable: false
        }
      ],
    }
  },
  methods: {
    //删除Tab
    removeTab(targetName) {
      let tabs = this.tabsItem; //当前显示的tab数组
      let activeName = this.activeTab; //点前活跃的tab

      //如果当前tab正活跃 被删除时执行
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.tabClick(nextTab)
            }
          }
        });
      }
      this.activeTab = activeName;
      this.tabsItem = tabs.filter(tab => tab.name !== targetName);

      //删除缓存
      const comName = tabs.find(tab => tab.name == targetName)?.comName;
      let setKeepAliveRoute = this.$store.state.mutations.keepAliveRoute.filter(el => el !== comName);
      this.$store.dispatch('commitKeepAliveRoute', setKeepAliveRoute);
    },
    tabClick(thisTab) {
      /*
      * thisTab:当前选中的tabs的实例
      * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
      * */
      this.$router.push({
        path: thisTab.name
      })
    },
    triggerTab(to){
      if(!this.tabsItem.some(item=>item.name === to.fullPath)){  //页面上不存在此tab，新增
        this.tabsItem.push({
          title: to.meta.title,
          name: to.fullPath,
          comName: to.name,
          closable: true
        })
        // 缓存路由
        if(to.meta.keepAlive){
          let setKeepAliveRoute = this.$store.state.mutations.keepAliveRoute;
          if(!setKeepAliveRoute.some(itm=>itm === to.name)){
            setKeepAliveRoute.push(to.name);
          }
          this.$store.dispatch('commitKeepAliveRoute', setKeepAliveRoute);
        }
      }
      this.activeTab = to.fullPath; //激活状态
    }
  },
  computed:{
    breadlist() {
      return this.$route.matched;
    },
    routes() {
      const route = this.$router.options.routes;
      return route;
    },
    isMenuStatus(){
      return this.$store.state.mutations.isMenuStatus
    },
    username(){
      return this.$store.state.mutations.userInfo?.name||"xx";
    },
    keepAliveRoute(){
      return this.$store.state.mutations.keepAliveRoute || [];
    }
  },
  watch: {
    '$route': function (to) {  //监听路由的变化，动态生成tabs
      this.triggerTab(to)
    }
  },
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
    /deep/ .el-menu-item.is-active {
      background-color: #1890ff !important;
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
    // background: #f0f2f5;
    transition: width 0.28s;
    vertical-align: top;
  }

  .content-wrap{
    
    /deep/ .el-tabs__header{
      margin: 0 !important;
    }

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