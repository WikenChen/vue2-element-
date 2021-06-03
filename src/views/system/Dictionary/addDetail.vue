<template>
  <div>
    <a-modal v-model="showModal" :maskClosable="false" :title="`${isEdit ? '编辑' : '添加'}字典数据`" @cancel="handleRes()">
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
        <a-form-item label="字典名称">
          <a-input ref="name" v-decorator="['name', { rules: [{ required: true, message: '请输入字典名称' }] }]" placeholder="字典名称"/>
        </a-form-item>
        <a-form-item label="数据键值">
          <a-input v-decorator="['value', { rules: [{ required: true, message: '请输入数据键值' }] }]" placeholder="数据键值" :disabled="isEdit ? true : false"/>
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-decorator="['sort']" :precision="0" class="w-100-percent" placeholder="排序" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-decorator="['enable']">
            <a-radio value="true">启用</a-radio>
            <a-radio value="false">禁用</a-radio>
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
import { createDictionayDetail, updateDictionayDetail } from '@/api/system'
export default {
  name: 'dictionaryAdd',
  data() {
    return {
      isLoading: false,
      form: this.$form.createForm(this),
      showModal: false,
      selectData: null,
      formItemLayout,
      isEdit: false
    };
  },
  methods: {
    // 打开模态框
    triggerModal(data, type){
      document.activeElement.blur();
      this.showModal = true;
      this.isEdit = type === 'edit' ? true :false;
      this.selectData = data;
      this.$nextTick(()=>{
        if(this.isEdit){
          let formData = this.form.getFieldsValue();
          for(let item in formData){
            if(item === 'enable'){
              formData[item] = this.selectData[item] ? 'true' : 'false';
            }else{
              formData[item] = this.selectData[item]
            }
          }
          this.form.setFieldsValue(formData)
        }else{
          this.form.setFieldsValue({
            enable: 'true',
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
          this.isLoading = true;
          let request = "";
          fieldsValue['dictId'] = this.selectData.dictId || this.selectData.id;
          fieldsValue['code'] = this.selectData.code;
          fieldsValue['tenantId'] = this.selectData.tenantId;

          if(this.isEdit){
            fieldsValue['syncFlag'] = this.selectData.syncFlag;
            fieldsValue['systemFlag'] = this.selectData.systemFlag;
            fieldsValue['id'] = this.selectData.id;
            request = updateDictionayDetail(fieldsValue)
          }else{
            request = createDictionayDetail(fieldsValue)
          }
          request.then(res => {
            this.isLoading = false;
            if(res.data.success){
              this.$message.success(`${this.isEdit ? '编辑' : '添加'}成功`);
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