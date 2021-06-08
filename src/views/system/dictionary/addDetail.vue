<template>
  <el-row>
    <el-dialog :title="`${this.isEdit ? '编辑' : '添加'}字典数据`" :visible.sync="showModal" :close-on-press-escape="false" :close-on-click-modal="false" @close="handleRes()" width="480px">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" autocomplete="off">
        <el-form-item label="字典名称：" prop="name">
          <el-input v-model="addForm.name" ref="name" placeholder="请填写字典名称"></el-input>
        </el-form-item>
        <el-form-item label="数据键值：" prop="value">
          <el-input v-model="addForm.value" placeholder="请填写数据键值" :disabled="isEdit ? true : false"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="addForm.sort" controls-position="right" :precision="0" class="w-100-percent ta-l" placeholder="请填写排序"></el-input-number>
        </el-form-item>
        <el-form-item label="状态：" prop="enable">
          <el-radio-group v-model="addForm.enable">
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
  import { createDictionayDetail, updateDictionayDetail } from '@/api/system'
  export default {
    name: 'dictionaryDetailAdd',
    data () {
      return {
        showModal: false,
        selectData: null,
        isEdit: false,
        addForm:{
          name:"",
          value:"",
          enable: 1,
          sort: undefined,
          remark: ""
        },
        addRules:{
          name: [ { required: true, message: '请填写字段名称' } ],
          value: [ { required: true, message: '请填写数据键值' } ]
        }
      }
    },
    methods: {
      // 打开模态框
      triggerModal(data, type){
        this.showModal = true;
        this.isEdit = type === 'edit' ? true :false;
        this.selectData = data;
        this.$nextTick(()=>{
          if(this.isEdit){
            for(let item in this.addForm){
              if(item === 'enable'){
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
            this.submitReq()
          }
        })
      },
      // 请求
      submitReq(){
        let addForm = JSON.parse(JSON.stringify(this.addForm));
        addForm.enable =  Boolean(addForm.enable);
        let request = "";
        
        if(this.isEdit){
          for(let item in this.selectData){
            if(!(item in addForm)){  //addform是否有当前属性 没有则给已有的值
              addForm[item] = this.selectData[item]
            }
          }
          request = updateDictionayDetail(addForm)
        }else{
          this.selectData.dictId ? addForm['parentId'] = this.selectData.id : addForm['dictId'] = this.selectData.id;
          addForm['code'] = this.selectData.code;
          addForm['tenantId'] = this.selectData.tenantId;
          request = createDictionayDetail(addForm)
        }

        this.$utils.showLoading(true);
        request.then(res => {
          if(res.data.success){
            this.$message.success(`${this.isEdit ? '编辑' : '添加'}成功`);
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
