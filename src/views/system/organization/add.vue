<template>
  <el-row>
    <el-button type="primary" icon="el-icon-plus" @click="triggerModal()">添加</el-button>
    <el-dialog :title="`${isCurrType === 'edit' ? '编辑' : isCurrType === 'view' ? '查看' : '添加'}组织`" :visible.sync="showModal" :close-on-press-escape="false" :close-on-click-modal="false" @close="handleRes()" width="980px">
      <el-form :model="addForm" size="medium" :rules="addRules" ref="addForm" label-width="100px" autocomplete="off">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称：" prop="name">
              <span v-if="isCurrType === 'view'">{{ !addForm.name ? "-" : addForm.name }}</span>
              <el-input v-model="addForm.name" ref="name" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编码：" prop="code">
              <span v-if="isCurrType === 'view'">{{ !addForm.code ? "-" : addForm.code }}</span>
              <el-input v-model="addForm.code" placeholder="请填写编码" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="打印名称：" prop="printName">
              <span v-if="isCurrType === 'view'">{{ !addForm.printName ? "-" : addForm.printName }}</span>
              <el-input v-model="addForm.printName" placeholder="请填写打印名称" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人：" prop="legalPerson">
              <span v-if="isCurrType === 'view'">{{ !addForm.legalPerson ? "-" : addForm.legalPerson }}</span>
              <el-input v-model="addForm.legalPerson" placeholder="请填写法人" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地址：" prop="address">
              <span v-if="isCurrType === 'view'">{{ !addForm.address ? "-" : addForm.address }}</span>
              <el-input v-model="addForm.address" placeholder="请填写地址" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="phone">
              <span v-if="isCurrType === 'view'">{{ !addForm.phone ? "-" : addForm.phone }}</span>
              <el-input v-model="addForm.phone" placeholder="请填写电话" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码：" prop="postcode">
              <span v-if="isCurrType === 'view'">{{ !addForm.postcode ? "-" : addForm.postcode }}</span>
              <el-input v-model="addForm.postcode" placeholder="请填写邮政编码" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="传真：" prop="fax">
              <span v-if="isCurrType === 'view'">{{ !addForm.fax ? "-" : addForm.fax }}</span>
              <el-input v-model="addForm.fax" placeholder="请填写传真" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱：" prop="email">
              <span v-if="isCurrType === 'view'">{{ !addForm.email ? "-" : addForm.email }}</span>
              <el-input v-model="addForm.email" placeholder="请填写邮箱" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税号：" prop="taxNo">
              <span v-if="isCurrType === 'view'">{{ !addForm.taxNo ? "-" : addForm.taxNo }}</span>
              <el-input v-model="addForm.taxNo" placeholder="请填写税号" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开户银行：" prop="depositBank">
              <span v-if="isCurrType === 'view'">{{ !addForm.depositBank ? "-" : addForm.depositBank }}</span>
              <el-input v-model="addForm.depositBank" placeholder="请填写开户银行" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织类型：" prop="type">
              <span v-if="isCurrType === 'view'">{{ !addForm.type ? "-" : organizationTypeList.find(itm=>itm.value === addForm.type).name }}</span>
              <el-select v-model="addForm.type" clearable placeholder="请选择组织类型" v-else>
                <el-option v-for="item in organizationTypeList" :key="item.id" :label="item.name" :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资料类型：" prop="dataType">
              <span v-if="isCurrType === 'view'">{{ !addForm.dataType ? "-" : dataTypeList.find(itm=>itm.value === addForm.dataType).name }}</span>
              <el-select v-model="addForm.dataType" clearable placeholder="请选择资料类型" v-else>
                <el-option v-for="item in dataTypeList" :key="item.id" :label="item.name" :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="银行账号：" prop="bankAccount">
              <span v-if="isCurrType === 'view'">{{ !addForm.bankAccount ? "-" : addForm.bankAccount }}</span>
              <el-input v-model="addForm.bankAccount" placeholder="请填写银行账号" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="助记码：" prop="keyword">
              <span v-if="isCurrType === 'view'">{{ !addForm.keyword ? "-" : addForm.keyword }}</span>
              <el-input v-model="addForm.keyword" placeholder="请填写助记码" v-else></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="enableFlag">
              <span v-if="isCurrType === 'view'">{{ addForm.enableFlag ? "启用" : '禁用' }}</span>
              <el-radio-group v-model="addForm.enableFlag" v-else>
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注：" prop="remark">
              <span v-if="isCurrType === 'view'">{{ !addForm.remark ? "-" : addForm.remark }}</span>
              <el-input
                v-else
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4}"
                v-model="addForm.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="valid" v-if="isCurrType !== 'view'">确定</el-button>
        <el-button @click="handleRes()">{{isCurrType !== 'view' ? '取消' : '返回'}}</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import { postOrganizations, putOrganizations } from '@/api/system'
  import { regPhone, regEmail } from '@/utils/reg.js'
  export default {
    name: 'organizationAdd',
    data () {
      return {
        showModal: false,
        selectData: null,
        isCurrType: "", //当前操作
        dataTypeList: [], //数据类型下拉
        organizationTypeList: [], //组织类型下拉
        addForm:{
          name:"",
          code:"",
          printName: "",
          legalPerson: "",
          address: "",
          phone: "",
          postcode: "",
          fax: "",
          email: "",
          taxNo: "",
          depositBank: "",
          type: "",
          dataType: "",
          bankAccount: "",
          keyword: "",
          enableFlag: 1,
          remark: ""
        },
        addRules:{
          name: [ { required: true, message: '请填写名称' } ],
          code: [ { required: true, message: '请填写编码' } ],
          phone: [ { validator: regPhone } ],
          email: [ { validator: regEmail } ]
        }
      }
    },
    methods: {
      // 打开模态框
      triggerModal(data, type){
        document.activeElement.blur();
        this.isCurrType = type;
        this.showModal = true;
        this.selectData = data || null;
        this.$nextTick(()=>{
          setTimeout(async ()=>{
            if(this.dataTypeList.length < 1 || this.organizationTypeList.length < 1){
              this.$utils.showLoading(true);
            }
            this.dataTypeList.length < 1 ? this.$set(this, 'dataTypeList', await this.$utils.getCodeDrop('DataType')) : null;
            this.organizationTypeList.length < 1 ? this.$set(this, 'organizationTypeList', await this.$utils.getCodeDrop('OrganizationType')) : null;
            this.$utils.showLoading(false);
            if(this.isCurrType === 'edit' || this.isCurrType === 'view'){
              for(let item in this.addForm){
                if(item === 'enableFlag'){
                  this.addForm[item] = this.selectData[item] ? 1 : 0;
                }else{
                  this.addForm[item] = this.selectData[item]
                }
              }
            }
          },0)
          this.isCurrType !== 'view' && this.$refs.name.focus();
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
        addForm.enableFlag =  Boolean(addForm.enableFlag);
        let request = "";
        addForm["parentId"] = this.isCurrType === 'edit' ? this.selectData.parentId : (this.selectData?.id || "0")
        if(this.isCurrType === 'edit'){
          addForm["id"] = this.selectData.id;
          request = putOrganizations(addForm)
        }else{
          request = postOrganizations(addForm)
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
