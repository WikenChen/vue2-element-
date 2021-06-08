<template>
  <el-row>
    <el-button type="primary" icon="el-icon-plus" @click="triggerModal()">添加</el-button>
    <el-dialog :title="`${this.selectData ? '编辑' : '添加'}用户`" :visible.sync="showModal" :close-on-press-escape="false" :close-on-click-modal="false" @close="handleRes()" width="480px">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" autocomplete="off">
        <el-form-item label="用户名称：" prop="name">
          <el-input v-model="addForm.name" ref="name" placeholder="请填写用户名称"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptId">
          <el-select v-model="addForm.deptId" placeholder="请选择部门" class="w-100-percent">
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色：" prop="roleIds">
          <el-select v-model="addForm.roleIds" placeholder="请选择角色" multiple collapse-tags class="w-100-percent">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录账号：" prop="username">
          <el-input v-model="addForm.username" placeholder="请填写登录账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" prop="password" v-if="!this.selectData">
          <el-input v-model="addForm.password" placeholder="请填写登录密码"></el-input>
        </el-form-item>
        <el-form-item label="用户状态：" prop="enableFlag">
          <el-radio-group v-model="addForm.enableFlag">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            v-model="addForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="valid">确定</el-button>
        <el-button @click="handleRes()">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import { putUsers, postUsers, getOrganizationsList, getRolesList } from '@/api/system'
  export default {
    name: 'userAdd',
    data () {
      return {
        showModal: false,
        selectData: null,
        deptList: [], //部门
        roleList: [], //角色
        addForm:{
          deptId: "",
          name:"",
          roleIds:"",
          username: "",
          password: "",
          enableFlag: 1,
          remark: ""
        },
        addRules:{
          deptId: [ { required: true, message: '请选择部门', trigger: 'change' } ],
          name: [ { required: true, message: '请填写配置名称' } ],
          username: [ { required: true, message: '请填写登录账号' } ],
          password: [ { required: true, message: '请填写登录密码' } ],
        }
      }
    },
    methods: {
      // 获取下拉数据源
      getSelectList(){
        let p1 = new Promise((resolve, reject) => { 
          // 部门
          getOrganizationsList(1,Infinity).then((res)=>{
            resolve(res)
          })
        })
        let p2 = new Promise((resolve, reject) => { 
          // 角色列表
          getRolesList(1,Infinity).then((res)=>{
            resolve(res)
          })
        })
        this.$utils.showLoading(true);
        Promise.all([p1, p2]).then(values => {
          this.deptList = values[0].data.data.resultList;
          this.roleList = values[1].data.data.resultList;
        }, err => {
            console.log(err)
        }).finally(()=>{
          this.$utils.showLoading(false);
        });
      },
      // 打开模态框
      triggerModal(data){
        this.showModal = true;
        // 异步打开 为了loading在模态框完全展示出来后在出现
        setTimeout(()=>{
          if(this.roleList.length < 1 && this.deptList.length < 1){
            this.getSelectList();
          }
        },0)
        this.$nextTick(()=>{
          if(data){
            this.selectData = data;
            for(let item in this.addForm){
              if(item === 'enableFlag' || item === 'systemFlag'){
                this.addForm[item] = this.selectData[item] ? 1 : 0;
              }else if(item === 'roleIds'){
                this.addForm[item] = this.selectData.roleList.map(item=>item.id)
              }else{
                this.addForm[item] = this.selectData[item]
              }
            }
          }
          this.$refs.name.focus();
        })
      },
      //验证
      valid(){
        this.$refs.addForm.validate((valid) => {
          if(valid){
            this.submitReq()
          }
        })
      },
      // 请求
      submitReq(){
        let addForm = JSON.parse(JSON.stringify(this.addForm));
        addForm.enable =  Boolean(addForm.enable);
        addForm.systemFlag = Boolean(addForm.systemFlag);
        addForm.roleIds = addForm.roleIds?.join(",") || "";
        this.selectData ? addForm['id'] = this.selectData.id : null;
        let request = this.selectData ? putUsers(addForm) : postUsers(addForm);
        this.$utils.showLoading(true);
        request.then(res => {
          if(res.data.success){
            this.$message.success(`${this.selectData ? '编辑' : '添加'}成功`);
            this.handleRes(true);
          }else{
            this.$utils.showLoading(false)
          }
        })
      },
      // 关闭模态框
      handleRes(bool = false){
        this.showModal = false;
        this.$nextTick(()=>{
          this.selectData = null;
          this.$refs.addForm.resetFields();
          bool && this.$emit('handleRes')
        })
      },
    }
  }
</script>
<style lang="less" scoped>
 
</style>
