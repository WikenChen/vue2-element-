<template>
  <el-row>
    <el-button type="primary" icon="el-icon-plus" @click="triggerModal()">添加</el-button>
    <el-dialog :title="`${this.selectData ? '编辑' : '添加'}数据字典`" :visible.sync="showModal" :close-on-press-escape="false" :close-on-click-modal="false" @close="handleRes()" width="480px">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" autocomplete="off">
        
        <el-form-item label="名称：" prop="name">
          <el-input v-model="addForm.name" ref="name" placeholder="请填写配置名称"></el-input>
        </el-form-item>
        <el-form-item label="编码：" prop="code">
          <el-input v-model="addForm.code" placeholder="请填写配置编码"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="enable">
          <el-radio-group v-model="addForm.enable">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="系统内置：" prop="systemFlag">
          <el-radio-group v-model="addForm.systemFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
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
  import { createDictionay, updateDictionay } from '@/api/system'
  export default {
    name: 'dictionaryAdd',
    data () {
      return {
        showModal: false,
        selectData: null,
        addForm:{
          name:"",
          code:"",
          enable: 1,
          systemFlag: 0,
          remark: ""
        },
        addRules:{
          name: [ { required: true, message: '请填写配置名称' } ],
          code: [ { required: true, message: '请填写配置编码' } ]
        }
      }
    },
    methods: {
      // 打开模态框
      triggerModal(data){
        this.showModal = true;
        this.$nextTick(()=>{
          if(data){
            this.selectData = data;
            for(let item in this.addForm){
              if(item === 'enable' || item === 'systemFlag'){
                this.addForm[item] = this.selectData[item] ? 1 : 0;
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
            if(this.selectData && this.selectData.systemFlag){
              this.$message.warning('此项配置为系统内置，不可修改');
              return;
            }

            this.submitReq()
          }
        })
      },
      // 请求
      submitReq(){
        let addForm = JSON.parse(JSON.stringify(this.addForm));
        addForm.enable =  Boolean(addForm.enable);
        addForm.systemFlag = Boolean(addForm.systemFlag);
        let request = "";
        if(this.selectData){
          addForm["id"] = this.selectData.id;
          addForm["deletedFlag"] = this.selectData.deletedFlag;
          addForm["syncFlag"] = this.selectData.syncFlag;
          request = updateDictionay(addForm)
        }else{
          request = createDictionay(addForm)
        }

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
