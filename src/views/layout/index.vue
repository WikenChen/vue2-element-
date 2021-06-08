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
          <router-view />
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
  async mounted(){
    let username = localStorage.getItem('lark_system_user')
    let res = await getInfo({username})
    if(res.data.success){
      localStorage.setItem('lark_system_userInfo', JSON.stringify(res.data.data))
      this.username = res.data.data.name;
    }
  },
  data(){
    return{
      username: "",

      activeTab: '1', //默认显示的tab
        tabIndex: 1, //tab目前显示数
        tabsItem: [
          {
            title: '首页',
            name: '/dashboard',
            closable: false
          }
        ],
    }
  },
  methods: {
    removeTab(targetName) { //删除Tab
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
      },
      tabClick(thisTab) {
        /*
        * thisTab:当前选中的tabs的实例
        * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
        * */
        this.$router.push({
          path: thisTab.name
        })
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
  },
  watch: {
    '$route': function (to) {  //监听路由的变化，动态生成tabs
      if(!this.tabsItem.some(item=>item.name === to.fullPath)){  //页面上不存在此tab，新增
        this.tabsItem.push({
          title: to.meta.title,
          name: to.fullPath,
          closable: true
        })
      }
      this.activeTab = to.fullPath; //激活状态
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