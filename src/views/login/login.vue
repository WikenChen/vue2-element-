<template>
  <el-form class="login-container" :model="loginForm" :rules="rules" ref="loginForm" autocomplete="off">
    <h2 class="login_title">系统登录</h2>
    <el-form-item  prop="username">
      <el-input placeholder="用户名" v-model="loginForm.username" prefix-icon="el-icon-user" clearable @keyup.enter.native="submitForm"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input placeholder="密码" v-model="loginForm.password" prefix-icon="el-icon-lock" show-password @keyup.enter.native="submitForm"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="w-100-percent" @click="submitForm">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { login }  from "@/api/login";
import md5 from 'js-md5'
export default {
  data() {
    return{
      rules:{
        username: [ { required: true, message: '请填写用户名' } ],
        password: [ { required: true, message: '请填写密码' } ]
      },
      loginForm: {
        username: "",
        password: ""
      },
    }
  },
  methods:{
    // 验证
    submitForm(){
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.loginForm))
          formData.password = md5(formData.password)
          this.reqLogin(formData);
        }
      });
    },
    // 登录请求
    reqLogin(formData){
      this.$utils.showLoading(true)
      login(formData).then(res=>{
        if(res.success){
          localStorage.setItem('gone_token', res.data.data.access_token);
          localStorage.setItem('gone_user', formData.username);
          this.$nextTick(()=>{
            this.$message.success('登录成功');
            this.$router.replace({ name: "system" });
          })
        }
      }).finally(() => {
        this.$utils.showLoading(false)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 170px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>