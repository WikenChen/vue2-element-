<template>
  <div>
    <a-modal
    v-model="showModal" :maskClosable="false" title="数据权限" @cancel="handleRes()"
    >
      <div class="wrap">
        <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }" autocomplete="off">
          <a-form-item label="名称">
            <a-input ref="name" v-decorator="['name']" disabled placeholder="名称"/>
          </a-form-item>
          <a-form-item label="编码">
            <a-input v-decorator="['code']" disabled placeholder="编码"/>
          </a-form-item>
          <h4 style="font-size:14px;text-indent:30px;margin-bottom:10px;">数据权限:</h4>
          <customTable
            :showPagination="false"
            :tableData="permissionList"
            :tableCol="columns"
            :tableHeight="tableHeight"
            :showCheckbox="true"
            :selectedRowKeys="selectedRowKeys"
            :defaultSelect="true"
            @selectChange="onSelectChange"
          >
          </customTable>
        </a-form>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="valid" :loading="isLoading">确定</a-button>
        <a-button @click="handleRes()">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import { putUpdateRoleDataPermission, getDataPermissions } from '@/api/system'
  export default {
    name: 'roleAddData',
    components: {
      customTable: () => import('@/components/customTable/index.vue'),
    },
    data () {
      return {
        isLoading: false,
        showModal: false,
        selectData: null,
        form: this.$form.createForm(this),
        tableHeight: window.innerHeight - 620,
        permissionList:[
          {
            id: "675176997894840832",
            bizNames:'1111',
            typeName:'22222',
            subTypeName:'333333'
          },
          {
            id: "2132343414214234",
            bizNames:'333',
            typeName:'222233332',
            subTypeName:'33333'
          }
        ],
        selectedRowKeys:[],
        // 表头
        columns : [
          { title: '类型', dataIndex: 'typeName' },
          { title: '数据范围', dataIndex: 'subTypeName'},
          { title: '数据权限', dataIndex: 'bizNames', width: 160 },
        ],
      }
    },
    methods: {
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      // 获取数据权限列表
      _getDataPermissions(){
        getDataPermissions().then(res => {
          if(res.success){
            this.permissionList = res.data.data.resultList || [];
          }
        })
      },
      // 打开模态框
      async triggerModal(data){
        this.selectedRowKeys = [];
        this.showModal = true;
        if(this.permissionList.length < 1){
          await this._getDataPermissions();
        }
        this.$nextTick(()=>{
          if(data){
            this.selectData = data;
            this.selectedRowKeys = data.dataPermissionList || [];
            let formData = this.form.getFieldsValue();
            for(let item in formData){
              formData[item] = this.selectData[item]
            }
            this.form.setFieldsValue(formData)
          }
          this.$refs.name.focus();
        })
      },
      //验证
      valid(){
        this.form.validateFields((err,fieldsValue) => {
          if (!err) {
            if(this.selectedRowKeys.length >0){
              fieldsValue.dataPermissionIds = this.selectedRowKeys.join(',')
            }else{
              fieldsValue.dataPermissionIds = ""
            }
            fieldsValue.id = this.selectData['id']
            delete fieldsValue.code;
            delete fieldsValue.name;
            this.isLoading = true;
            putUpdateRoleDataPermission(fieldsValue).then(res => {
              this.isLoading = false;
              if(res.data.success){
                this.$message.success('添加权限成功');
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
    }
  }
</script>
<style lang="less" scoped>
    // .wrap {
    //   height: 450px;
    //   overflow: auto;
    // }
</style>