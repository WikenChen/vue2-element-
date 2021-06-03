<template>
  <div>
    <a-button type="primary" @click="triggerModal()">添加</a-button>
    <a-modal
    v-model="showModal" :maskClosable="false" :title="`${selectData ? '编辑' : '添加'}角色`" @cancel="handleRes()"
    >
      <div class="wrap">
        <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }" autocomplete="off">
          <a-form-item label="名称">
            <a-input ref="name" v-decorator="['name', {rules: [{required: true, message: '请输入名称！'}]}]" placeholder="名称"/>
          </a-form-item>
          <a-form-item label="编码">
            <a-input v-decorator="['code', {rules: [{required: true, message: '请输入编码！'}]}]" placeholder="编码"/>
          </a-form-item>
          <a-form-item label="状态">
            <a-radio-group v-decorator="['enableFlag']">
              <a-radio value="true">启用</a-radio>
              <a-radio value="false">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea :rows="4" placeholder="备注" v-decorator="['remark']"></a-textarea>
          </a-form-item>
          <a-form-item label="菜单权限">
            <a-tree
              v-model="checkedKeys"
              multiple
              checkable
              :tree-data="menuTreeData"
              :checkStrictly='false'
              @check="onCheck"
              v-decorator="['permissionIds']"
            />
          </a-form-item>
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
  import { postRoles, putRoles,getPermissionTree,getRolesDetail  } from '@/api/system'
  export default {
    name: 'roleAdd',
    data () {
      return {
        isLoading: false,
        showModal: false,
        selectData: null,
        form: this.$form.createForm(this),
        menuTreeData: [],
        checkedKeys: [],
        array:[]
        // replaceFields: {
        //   key: 'id',
        //   title:'name'
        // },
      }
    },
    methods: {
      // 获取菜单列表
      _getMenuTree(){
        getPermissionTree().then(res => {
          if(res.success){
            // this.menuTreeData = res.data.data
            let data = res.data.data || [];
            let tree = [];
            data.forEach((item,index) => {
              tree.push(this.handleTreeData(item,index));
            })
            this.menuTreeData = tree;
            this.array = this.handleRecursive(tree);
          }
        })
      },
      // 递归菜单
      handleTreeData(data, index) {
        let childrenNode = {
          title: data.name,
          value: data.id,
          key: data.id,
          id: data.id,
          parentId: data.parentId,
          name: data.name,
          sortNo: data.sortNo,
          routeUrl: data.routeUrl,
          type: data.type,
          visibleFlag: data.visibleFlag,
          createTime: data.createTime,
          remark: data.remark
        }
        if (data.children && data.children.length > 0) {
          childrenNode.children = []
          data.children.forEach((element, subIndex) => {
            let subKey = `${index}-${subIndex}`
            childrenNode.children.push(this.handleTreeData(element, subKey))
          })
        }
        return childrenNode
      },
      handleRecursive(data){
        let list = []
        const fn = (source)=>{
          source.forEach(el=>{
            list.push(el)
            el.children && el.children.length>0 ? fn(el.children) : ""
          })
        }
        fn(data)
        return list
      },
      // 勾选菜单
      onCheck(checkedKeys) {
        this.checkedKeys = checkedKeys
      },
      // 打开模态框
      async triggerModal(data){
        this.checkedKeys = [];
        this.showModal = true;
        if(this.menuTreeData.length < 1){
          await this._getMenuTree();
        }
        this.$nextTick(()=>{
          if(data){
            let formData = this.form.getFieldsValue();
            getRolesDetail(data['id']).then(res=>{
              if(res.success){
                this.selectData = res.data.data;
                for(let item in formData){
                  if(item === 'enableFlag'){
                    formData[item] = this.selectData[item] ? 'true' : 'false';
                  }else{
                    formData[item] = this.selectData[item]
                    let permissionList = this.selectData['permissionList']
                    let checkedList = [];
                    if(permissionList && permissionList.length>0){
                      permissionList.forEach(item => checkedList.push(item.id))
                    }
                    setTimeout(()=>{
                      this.checkedKeys = checkedList
                    },210)
                  }
                }
                this.form.setFieldsValue(formData)
              }
            })
          }else{
            this.form.setFieldsValue({
              enableFlag: 'true',
            })
          }
          this.$refs.name.focus();
        })
      },
      //验证
      valid(){
        this.form.validateFields((err,fieldsValue) => {
          if (!err) {
            fieldsValue.enableFlag = fieldsValue.enableFlag === 'true' ? true :false;
            let checkedList = this.checkedKeys;
            if(checkedList.length >0){
              let list = [];
              let array = this.array;
              array.forEach(item=>{
                checkedList.forEach(key => {
                  if(item.id == key){
                    list.push(`${item.id}|${item.parentId}`)
                  }
                })
              })
              fieldsValue.permissionIds = list.join(',')
            }else{
              fieldsValue.permissionIds = ""
            }
            this.isLoading = true;
            let request = "";
            if(this.selectData){
              fieldsValue["id"] = this.selectData.id;
              request = putRoles(fieldsValue)
            }else{
              request = postRoles(fieldsValue)
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
    }
  }
</script>
<style lang="less" scoped>
    .wrap {
      height: 450px;
      overflow: auto;
    }
</style>
