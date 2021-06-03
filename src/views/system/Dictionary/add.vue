<template>
  <div>
    <a-button type="primary" @click="triggerModal()">添加</a-button>
    <a-modal v-model="showModal" :maskClosable="false" :title="`${selectData ? '编辑' : '添加'}数据字典`" @cancel="handleRes()">
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
        <a-form-item label="名称">
          <a-input ref="name" v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]" placeholder="名称"/>
        </a-form-item>
        <a-form-item label="编码">
          <a-input v-decorator="['code', { rules: [{ required: true, message: '请输入编码' }] }]" placeholder="编码" :disabled="selectData ? true : false"/>
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-decorator="['enable']">
            <a-radio value="true">启用</a-radio>
            <a-radio value="false">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="系统内置">
          <a-radio-group v-decorator="['systemFlag']">
            <a-radio value="true">是</a-radio>
            <a-radio value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea  v-decorator="['remark']" rows="5"></a-textarea>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button type="primary" @click="valid" :loading="isLoading">确定</a-button>
        <a-button @click="handleRes()">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
import { createDictionay, updateDictionay } from '@/api/system'
export default {
  name: 'dictionaryAdd',
  data() {
    return {
      isLoading: false,
      form: this.$form.createForm(this),
      showModal: false,
      selectData: null,
      formItemLayout,
    };
  },
  methods: {
    // 打开模态框
    triggerModal(data){
      document.activeElement.blur();
      this.showModal = true;
      this.$nextTick(()=>{
        if(data){
          this.selectData = data;
          let formData = this.form.getFieldsValue();
          for(let item in formData){
            if(item === 'enable' || item === 'systemFlag'){
              formData[item] = this.selectData[item] ? 'true' : 'false';
            }else{
              formData[item] = this.selectData[item]
            }
          }
          this.form.setFieldsValue(formData)
        }else{
          this.form.setFieldsValue({
            enable: 'true',
            systemFlag: 'false'
          })
        }
        this.$refs.name.focus();
      })
    },
    //验证
    valid(){
      this.form.validateFields((err,fieldsValue) => {
        if (!err) {
          fieldsValue.enable = fieldsValue.enable === 'true' ? true :false;
          fieldsValue.systemFlag = fieldsValue.systemFlag === 'true' ? true :false;
          this.isLoading = true;
          let request = "";
          if(this.selectData){
            fieldsValue["id"] = this.selectData.id;
            fieldsValue["deletedFlag"] = this.selectData.deletedFlag;
            fieldsValue["syncFlag"] = this.selectData.syncFlag;
            request = updateDictionay(fieldsValue)
          }else{
            request = createDictionay(fieldsValue)
          }
          request.then(res => {
            this.isLoading = false;
            if(res.data.success){
              this.$message.success(`${this.selectData ? '编辑' : '添加'}成功`);
              this.handleRes(true);
            }
          })
        }
      });
    },
    // 关闭模态框
    handleRes(bool = false){
      this.showModal = false;
      this.$nextTick(()=>{
        this.selectData = null;
        this.form.resetFields();
        bool && this.$emit('handleRes')
      })
    },
  },
};
</script>