<template>
  <el-row>
    <el-button type="primary" icon="el-icon-plus" @click="triggerModal()">添加</el-button>
    <el-dialog :title="`${this.isCurrType === 'edit' ? '编辑' : '添加'}菜单`" :visible.sync="showModal" :close-on-press-escape="false" :close-on-click-modal="false" @close="handleRes()" width="640px">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px" autocomplete="off">
        <el-form-item label="菜单类型：" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="catalog">目录</el-radio>
            <el-radio label="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="parentId" v-if="showModal">
          <el-cascader v-model="addForm.parentId" :options="treeData" :props="treeProps" class="w-100-percent" placeholder="请选择上级菜单" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model="addForm.name" placeholder="请填写菜单名称" ref="name"></el-input>
        </el-form-item>
        <el-form-item label="组件路径：" prop="routeUrl" v-if="addForm.type !== 'button'">
          <el-input v-model="addForm.routeUrl" placeholder="请填写组件路径(path)"></el-input>
        </el-form-item>
        <el-form-item label="组件：" prop="component" v-if="addForm.type !== 'button'">
          <el-input v-model="addForm.component" placeholder="请填写组件(component)"></el-input>
        </el-form-item>
        <el-form-item label="组件名称：" prop="routeName" v-if="addForm.type !== 'button'">
          <el-input v-model="addForm.routeName" placeholder="请填写组件名称(name)"></el-input>
        </el-form-item>
        <el-form-item label="重定向地址：" prop="redirect" v-if="addForm.type === 'catalog'">
          <el-input v-model="addForm.redirect" placeholder="请填写重定向地址"></el-input>
        </el-form-item>
        <el-form-item label="请求方式：" prop="httpMethod" v-if="addForm.type == 'menu' || addForm.type == 'button'">
          <el-select v-model="addForm.httpMethod" placeholder="请选择请求方式" class="w-100-percent">
            <el-option v-for="item in httpMethodList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单图标：" prop="icon" v-if="addForm.type === 'catalog'">
          <el-input v-model="addForm.icon" placeholder="请填写菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="授权url：" prop="permitUrl" v-if="addForm.type == 'menu' || addForm.type == 'button'">
          <el-input v-model="addForm.permitUrl" placeholder="请填写授权url"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sortNo">
          <el-input-number v-model="addForm.sortNo" controls-position="right" :precision="0" class="w-100-percent ta-l" placeholder="请填写排序"></el-input-number>
        </el-form-item>
        <el-form-item label="POS菜单权限：" prop="posFlag" class="w-200 dib" v-if="addForm.type !== 'button'">
          <el-switch v-model="addForm.posFlag" ></el-switch>
        </el-form-item>
        <el-form-item label="是否显示菜单：" prop="visibleFlag" class="w-200 dib" v-if="addForm.type !== 'button'">
          <el-switch v-model="addForm.visibleFlag" ></el-switch>
        </el-form-item>
        <el-form-item label="是否缓存路由：" prop="keepAlive" class="w-200 dib" v-if="addForm.type !== 'button'">
          <el-switch v-model="addForm.keepAlive" ></el-switch>
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
  import { putPermission, postPermission } from '@/api/system'
  export default {
    name: 'userAdd',
    props:{
      treeData:{
        type: Array,
        default: ()=>[]
      }
    },
    data () {
      return {
        httpMethodList: [],
        treeProps: {
          label: 'name',
          value: 'id',
          checkStrictly: true,  //是否严格的遵守父子节点不互相关联
        },
        isCurrType: "",
        showModal: false,
        selectData: null,
        addForm:{
          type: "menu",
          parentId: [],
          name:"",
          routeUrl: "",
          routeName: "",
          component: "",
          redirect: "",
          httpMethod: "",
          icon: "",
          permitUrl: "",
          sortNo: undefined,
          posFlag: false,
          visibleFlag: true,
          keepAlive: false
        },
        addRules:{
          name: [ { required: true, message: '请填写菜单名称' } ],
          routeUrl: [ { required: true, message: '请填写组件路径' } ],
          component: [ { required: true, message: '请填写组件' } ],
          routeName: [ { required: true, message: '请填写组件名称' } ],
          sortNo: [ { required: true, message: '请填写排序' } ]
        }
      }
    },
    methods: {
      // 打开模态框
      triggerModal(data, type){
        this.isCurrType = type;
        this.showModal = true;
        this.addForm.parentId = [];
        // 异步打开 为了loading在模态框完全展示出来后在出现
        setTimeout(async()=>{
          if(this.httpMethodList.length < 1){
            this.$utils.showLoading(true);
          }
          this.httpMethodList.length < 1 ? this.$set(this, 'httpMethodList', await this.$utils.getCodeDrop('HttpMethod')) : null;
          this.$utils.showLoading(false);
        },0)
        this.selectData = data || null;
        this.$nextTick(()=>{
          if(this.isCurrType === 'edit'){
            for(let item in this.addForm){
              if(item !== 'parentId'){
                this.addForm[item] = this.selectData[item]
              }
            }
          }
          if(data.parentId){
            this.parseData(this.treeData)
          }else{
            this.addForm.parentId = [];
          }
        })
      },
      parseData(arr){
        arr.forEach(item=>{
          if(item.id === this.selectData.id){
            this.addForm.parentId = item.parentIdArr
            return;
          }
          if(item.children?.length){
            this.parseData(item.children);
          }
        })
      },
      //验证
      valid(){
        this.$refs.addForm.validate((valid) => {
          if(valid){
            if(this.isCurrType === 'edit' && this.addForm.parentId.length && this.addForm.parentId[this.addForm.parentId.length-1] === this.selectData.id){
              this.$message.warning('上级菜单不可选自身');
              return;
            }
            this.submitReq()
          }
        })
      },
      // 请求
      submitReq(){
        let addForm = JSON.parse(JSON.stringify(this.addForm));
        this.isCurrType === 'edit' ? addForm['id'] = this.selectData.id : null;
        addForm['tenantId'] = JSON.parse(localStorage.getItem('projectxx_userInfo')).tenantId;
        addForm['parentId'] = addForm.parentId.length ? addForm.parentId[addForm.parentId.length-1] : '0';
        let request = this.isCurrType === 'edit' ? putPermission(addForm) : postPermission(addForm);
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
