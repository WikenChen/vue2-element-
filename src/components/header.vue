<template>
  <div id="header-warp">
    <div class="dib">
      <i class="trigger-menu-icon pointer" :class="[isMenuStatus ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="triggerMenu"></i>
      <el-breadcrumb separator="/" class="dib va-m">
        <template v-for="item in breadcrumbArr">
          <el-breadcrumb-item :key='item.name' v-if="item.meta.title">{{item.meta.title}}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="userinfo">
      <el-dropdown trigger="click">
        <span class="userinfoItem pointer">
          {{username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>
            <div >修改密码</div>
          </el-dropdown-item> -->
          <el-dropdown-item>
            <div style="width: 120px;" @click="handleLogout">退出登录</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { logout }  from "@/api/login";
export default {
  props: {
    username: {
      type: String
    }
  },
  methods:{
    triggerMenu(){
      const currMenuStatus = this.$store.state.mutations.isMenuStatus;
      this.$store.dispatch('commitMenuStatus', !currMenuStatus);
    },
    handleLogout(){
      const _this = this;
      this.$confirm('是否退出登录？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // logout().then(res=>{
        //   if(res.data.success){
        //     localStorage.removeItem('projectxx_token')
        //     localStorage.removeItem('projectxx_userInfo')
        //     _this.$router.replace('login')
        //   }
        // })
        _this.$nextTick(()=>{
          localStorage.removeItem('projectxx_token')
          _this.$router.replace('login')
        })
      }).catch(()=>{})
    },
  },
  computed:{
    isMenuStatus(){
      return this.$store.state.mutations.isMenuStatus;
    },
    breadcrumbArr(){
      return this.$route.matched;
    }
  }
}
</script>

<style lang="less" scoped>
#header-warp{
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 10px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  border-bottom: 1px solid #E4E7ED;

  .userinfo{
    display: inline-block;
    width: 250px;
    text-align: right;
    margin-right: 15px;
  }

  .trigger-menu-icon{
    font-size: 24px;
    vertical-align: middle;
    color: #666;
    margin-right: 10px;
  }
}
</style>