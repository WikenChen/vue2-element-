<template>
  <el-row class="pd20 userManage">
      <el-col class="menu-wrap">
        <el-tree 
          ref="orgTree"
          :data="treeData" 
          :expand-on-click-node="false"
          :props="treeProps"
          node-key="id"
          highlight-current
          @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col class="content-wrap">
        <section class="search-form-contain">
          <el-form :inline="true" ref="searchForm" :model="searchFrom">
            <el-form-item prop="username">
              <el-input v-model="searchFrom.username" placeholder="登录名称"></el-input>
            </el-form-item>
            <el-form-item prop="name">
              <el-input v-model="searchFrom.name" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item prop="enableFlag">
              <el-select v-model="searchFrom.enableFlag" clearable placeholder="状态">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchList">查询</el-button>
              <el-button type="warning" @click="resetList">重置</el-button>
            </el-form-item>
          </el-form>
        </section>
        <section>
          <addUser ref="addUser" @handleRes="getList" />
        </section>
        <section class="mt10">
          <cTable 
            :table-list="tableData" 
            :table-col="tableCol" 
            :pager="pager" 
            @handleChangeSize="changeSize"
            @handleChangePage="changePage" 
            :height="calculateTbHeight()"></cTable>
        </section>
      </el-col>
  </el-row>
</template>

<script>
import {  getUserList, delUsers, getOrgTree } from '@/api/system';
export default {
  name: 'userList',
  components:{
    addUser: ()=>import('./add'),
    cTable: ()=> import("@/components/customTable.vue"),
  },
  data() {
    return {
      treeData: [],
      treeProps: {
        value: 'id',
        children: 'children',
        label: 'name'
      },
      currSelectId: null, //当前选中树节点
      searchFrom:{
        name: "",
        username: "",
        enableFlag: ""
      },
      tableCol: [
        { label: '登录名称', prop: 'username' },
        { label: '用户名称', prop: 'name' },
        { label: '角色', prop: 'roleName', render: (h, data)=>{
          const name = data.row.roleList.map(item=>item.name).join(",");
          return <span>{name}</span>;
        }  },
        { label: '部门', prop: 'deptName'},
        { label: '用户状态', width: 90, align: 'center', render: (h, data)=>{
          return <el-switch v-model={data.row.enableFlag} onChange={()=>{this.opeGroup(data.row, 'enable')}}></el-switch>
        } },
        { label: '备注', prop: 'remark', tooltip: true },
        { label: '创建时间', prop: 'createTime', width: 160 },
        { label: "操作", width: 240, render: (h, data) => {
          const opeList = [{key: '编辑', value: 'edit'}, {key: '重置密码', value: 'resetPass'}, {key: '删除', value: 'delete'}]
            return opeList.map( item =>
              <el-button 
                size="mini"
                type={item.value === 'delete' ? "danger" : "primary"}
                onClick={() => { this.opeGroup(data.row, item.value); }}
              >{item.key }</el-button>
            )
          },
        },
      ],
      tableData: [],
      pager: this.$utils.pager()
    };
  },
  mounted(){
    this.getTree();
    this.getList();
  },
  methods: {
    // 获取树结构数据
    getTree(){
      getOrgTree().then((res) => {
        if (res.success) {
          this.treeData = res.data.data || [];
        }
      })
    },
    
    // 点击左侧树节点
    handleNodeClick(data, node, elem) {
      if(this.currSelectId === data.id){  //重复点击，清空选中
        this.$refs.orgTree.setCurrentKey(null);
        this.currSelectId = null;
      }else{
        this.currSelectId = data.id;
      }
      this.getList();
    },
    // 表格高度
    calculateTbHeight(){
      return this.$refs.searchForm ? this.$utils.fullHeight() - this.$refs.searchForm.$el.offsetHeight - 220 : 300;
    },
    // 重置列表
    resetList(){
      this.$refs.searchForm.resetFields();
      this.searchList();
    },
    // 查询列表
    searchList(){
      this.pager.pageIndex = 1;
      this.getList();
    },
    // 获取列表
    getList(){
      let searchForm = JSON.parse(JSON.stringify(this.searchFrom));
      searchForm['deptId'] = this.currSelectId;
      this.$utils.showLoading(true);
      getUserList(this.pager.pageIndex, this.pager.pageSize, searchForm).then((res) => {
        this.$utils.showLoading(false);
        if (res.success) {
          this.tableData = res.data.data.resultList;
          this.pager.totalItems = res.data.data.total;
        }
      })
    },
    // 改变表格条数
    changeSize(val){
      this.pager.pageSize = val;
      this.getList();
    },
    // 改变表格页数
    changePage(val){
      this.pager.pageIndex = val;
      this.getList();
    },
    // 操作组
    opeGroup(row, type) {
      document.activeElement.blur() //取消默认聚焦
      switch(type){
        case 'edit':
          this.$refs.addUser.triggerModal(row)
          break;
        case 'enable':
          this.$message.error('等待启禁用接口,暂时没有')
          break;
        case 'resetPass':
        case 'delete':
          this.confirmOpe(row, type)
          break;
      }
    },
    // 确认删除，重置密码
    confirmOpe(rowData, type) {
      const _this = this;
      this.$confirm(`是否确定${type === 'delete' ? '删除' : '重置密码'}？`, type === 'delete' ? '删除' : '重置密码', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        _this.$utils.showLoading(true);
        delUsers(rowData.id).then((res) => {
          if (res.data.success) {
            _this.$message.success(`${type === 'delete' ? '删除成功' : '重置密码成功。密码为：123456'}`)
            _this.getList()
          } else {
            _this.$utils.showLoading(false);
          }
        })
      }).catch(()=>{})
    },
  },
}
</script>

<style lang="less" scoped>
.userManage{
  .menu-wrap{
    width: 240px;
    display: inline-block;
    height: calc(100vh - 145px);
    margin-right: 10px;
  }
  .content-wrap{
    width: calc(100% - 253px);
    display: inline-block;
  }
  .el-tree{
    .el-tree-node__content:hover{background-color: #e6f7ff;}
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{background-color:#bae7ff}
}
</style>
