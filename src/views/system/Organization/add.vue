<template>
  <div>
    <a-button type="primary" @click="triggerModal()">添加</a-button>
    <a-modal v-model="showModal" :maskClosable="false" :title="`${isCurrType === 'edit' ? '编辑' : isCurrType === 'view' ? '查看' : '添加'}组织`" @cancel="handleRes()" :width="960">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <a-row>
          <a-col :span="8">
            <a-form-item label="名称">
              <a-input ref="name" v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="编号">
              <a-input v-decorator="['code', { rules: [{ required: true, message: '请输入编码' }] }]" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="打印名称">
              <a-input v-decorator="['printName']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="法人">
              <a-input v-decorator="['legalPerson']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <!-- <a-col v-show="false">
            <a-form-item label="经营范围id">
              <a-input v-decorator="['businessScope']" placeholder="经营范围id"/>
            </a-form-item>
          </a-col> -->
          <!-- <a-col :span="8">
            <a-form-item label="经营范围">
              <span @click="showInputModal('businessScopeName')">
                <a-input v-decorator="['businessScopeName']" :read-only="true" placeholder="经营范围">
                  <div slot="suffix">
                    <a-icon type="check-circle" style="color:#BFBFBF;" />
                  </div>
                </a-input>
              </span>
            </a-form-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-item label="地址">
              <a-input v-decorator="['address']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="电话">
              <a-input v-decorator="['phone', { rules: [{ validator: regPhone }] }]" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮政编码">
              <a-input v-decorator="['postcode']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="传真">
              <a-input v-decorator="['fax']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮箱">
              <a-input v-decorator="['email', { rules: [{ validator: regEmail }] }]" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="税号">
              <a-input v-decorator="['taxNo']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="开户银行">
              <a-input v-decorator="['depositBank']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="组织类型">
              <a-select v-decorator="['type']" allowClear :disabled="isCurrType === 'view'">
                <a-select-option v-for="item in organizationTypeList" :key="item.id" :value="item.value">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="资料类型">
              <a-select v-decorator="['dataType']" allowClear :disabled="isCurrType === 'view'">
                <a-select-option v-for="item in dataTypeList" :key="item.id" :value="item.value">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="银行账号">
              <a-input v-decorator="['bankAccount']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="助记码">
              <a-input v-decorator="['keyword']" :disabled="isCurrType === 'view'"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否正常">
              <a-radio-group v-decorator="['enableFlag']" :disabled="isCurrType === 'view'">
                <a-radio value="true">是</a-radio>
                <a-radio value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="备注说明">
              <a-textarea  v-decorator="['remark']" rows="5" :disabled="isCurrType === 'view'"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-button type="primary" @click="valid" :loading="isLoading" v-if="isCurrType !== 'view'">确定</a-button>
        <a-button @click="handleRes()">{{isCurrType === 'view' ? '返回' : '取消'}}</a-button>
      </template>
    </a-modal>
    <!-- <businessScopeName 
      ref="businessScopeName"
      :modalCol="modalCol"
      :modalData="modalData"
      :modalTitle="modalTitle"
      @modalConfirm="modalConfirm"
    /> -->
  </div>
</template>
<script>
import { regPhone, regEmail } from '@/common/js/reg.js'
import { postOrganizations, putOrganizations } from '@/api/system'
import { getCodeDrop } from '@/utils/util'
// import selectConfig from '@/utils/selectConfig'
export default {
  name: 'dictionaryAdd',
  components:{
    // selectConfig: () => import('@/views/publicComp/selectConfig'),
  },
  data() {
    return {
      expand: false,
      isLoading: false,
      form: this.$form.createForm(this),
      showModal: false,
      selectData: null,
      dataTypeList: [], //数据类型下拉
      organizationTypeList: [], //组织类型下拉
      isCurrType: "",
      regEmail,
      regPhone

      // 选择器相关
      // modalTitle: '请选择经营范围',
      // modalData: [],
      // modalCol: selectConfig.businessScopeName
    };
  },
  methods: {
    // 打开模态框
    async triggerModal(data, type){
      document.activeElement.blur()
      this.isCurrType = type;
      this.showModal = true;
      this.dataTypeList.length < 1 ? this.$set(this, 'dataTypeList', await getCodeDrop('DataType')) : null;
      this.organizationTypeList.length < 1 ? this.$set(this, 'organizationTypeList', await getCodeDrop('OrganizationType')) : null;
      this.selectData = data || null;
      this.$nextTick(()=>{
        if(this.isCurrType === 'edit' || this.isCurrType === 'view'){
          let formData = this.form.getFieldsValue();
          for(let item in formData){
            if(item === 'enableFlag'){
              formData[item] = this.selectData[item] ? 'true' : 'false';
            }else{
              formData[item] = this.selectData[item]
            }
          }
          this.form.setFieldsValue(formData)
        }else{
          this.form.setFieldsValue({
            enableFlag: 'true',
          })
        }
        this.$refs.name.focus();
      })
    },
    // async showInputModal(val){
    //   // let res = await getScopesList(1,10)
    //   // this.modalData = res.data.data.resultList
    //   this.modalData = [{
    //     createTime: "2021-05-12 15:44:06",
    //     creatorId: "154",
    //     creatorName: "杨乐",
    //     deletedFlag: 0,
    //     explanation: null,
    //     id: "674876139730696704",
    //     keyword: "JYFWZJM001",
    //     name: "经营范围001",
    //     tenantId: 1,
    //     type: "manage",
    //     typeName: "经营范围",
    //     updateTime: null,
    //     updaterId: null,
    //     updaterName: null
    //   }]
    //   this.$refs.businessScopeName.triggerModal()
    // },
    // modalConfirm(selectedRowKeys){
    //   console.log(selectedRowKeys)
    // },
    //验证
    valid(){
      this.form.validateFields((err,fieldsValue) => {
        if (!err) {
          fieldsValue.enableFlag = fieldsValue.enableFlag === 'true' ? true :false;
          this.isLoading = true;
          let request = "";
          fieldsValue["parentId"] = this.isCurrType === 'edit' ? this.selectData.parentId : (this.selectData?.id || "0")
          if(this.isCurrType === 'edit'){
            fieldsValue["id"] = this.selectData.id;
            request = putOrganizations(fieldsValue)
          }else{
            request = postOrganizations(fieldsValue)
          }
          request.then(res => {
            this.isLoading = false;
            if(res.data.success){
              this.$message.success(`${this.isCurrType === 'edit' ? '编辑' : '添加'}成功`);
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