<template>
  <el-row class="roleAdd">
    <el-button type="primary" icon="el-icon-plus" @click="triggerModal()">添加</el-button>
    <el-dialog :title="`${this.selectData ? '编辑' : '添加'}角色`" :visible.sync="showModal" :close-on-press-escape="false" :close-on-click-modal="false" @close="handleRes()" width="480px">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" autocomplete="off" class="wrap-form">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="addForm.name" ref="name" placeholder="请填写配置名称"></el-input>
        </el-form-item>
        <el-form-item label="编码：" prop="code">
          <el-input v-model="addForm.code" placeholder="请填写配置编码"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="enableFlag">
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
        <el-form-item label="菜单权限：" prop="remark" style="margin-bottom:0;">
          <el-tree 
            class="menu-tree"
            ref="menuTree"
            show-checkbox
            :data="treeData" 
            :expand-on-click-node="false"
            :props="treeProps"
            node-key="id"></el-tree>
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
  import { putRoles,postRoles, getAuthorizationTree, getRolesDetail } from '@/api/system'
  export default {
    name: 'roleAdd',
    data () {
      return {
        showModal: false,
        selectData: null,
        treeData: [],
        treeProps: {
          value: 'id',
          children: 'children',
          label: 'name'
        },
        addForm:{
          name:"",
          code:"",
          value: "",
          enableFlag: 1,
          remark: ""
        },
        addRules:{
          name: [ { required: true, message: '请填写名称' } ],
          code: [ { required: true, message: '请填写编码' } ]
        }
      }
    },
    methods: {
      // 获取树结构数据
      getTree(){
        this.$utils.showLoading(true);
        getAuthorizationTree().then((res) => {
          this.$utils.showLoading(false);
          if (res.success) {
            this.treeData = res.data.data || [];
          }
        })
      },
      // 打开模态框
      triggerModal(data){
        this.showModal = true;
        
        this.$nextTick(()=>{
          setTimeout(()=>{
            if(this.treeData.length<1){
              this.getTree();
            }
            if(data){
              this.getDetail(data.id);
            }
            this.$refs.name.focus();
          },0)
        })
      },
      getDetail(id){
        this.$utils.showLoading(true);
        getRolesDetail(id).then((res)=>{
          this.$utils.showLoading(false);
          if (res.success) {
            this.selectData = res.data.data;
            this.$refs.menuTree.setCheckedKeys(res.data.data.permissionList.map(item=>item.id));  //默认勾选树节点
            for(let item in this.addForm){
              if(item === 'enableFlag'){
                this.addForm[item] = this.selectData[item] ? 1 : 0;
              }else{
                this.addForm[item] = this.selectData[item]
              }
            }
          }
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
        const selectTree = this.$refs.menuTree.getCheckedNodes(); //树选中的数据结构，数组类型
        let addForm = JSON.parse(JSON.stringify(this.addForm));
        addForm.enableFlag =  Boolean(addForm.enableFlag);
        this.selectData ? addForm['id'] = this.selectData.id : null;
        addForm.permissionIds = selectTree.map(item => `${item.id}|${item.parentId || '0'}`).join(',')
        let request = this.selectData ? putRoles(addForm) : postRoles(addForm);
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
          this.$refs.menuTree.setCheckedKeys([]); //清空树勾选
          this.$refs.addForm.resetFields();
          bool && this.$emit('handleRes')
        })
      },
    }
  }
</script>
<style lang="less" scoped>
.wrap-form{
  height: 450px;
  overflow-y: auto;
}
//  .menu-tree{
//    height: 200px;
//    overflow-y: auto;
//  }
</style>
