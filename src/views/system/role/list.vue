<template>
  <el-row class="pd20">
    <section class="search-form-contain">
      <el-form :inline="true" ref="searchForm" :model="searchFrom">
        <el-form-item prop="name">
          <el-input v-model="searchFrom.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="searchFrom.code" placeholder="角色编码"></el-input>
        </el-form-item>
        <el-form-item prop="enableFlag">
          <el-select v-model="searchFrom.enableFlag" placeholder="状态" clearable>
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="timeGroup"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始创建日期"
            end-placeholder="结束创建日期"
            format="yyyy-MM-DD HH:mm:ss"
            value-format="yyyy-MM-DD HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchList">查询</el-button>
          <el-button type="warning" @click="resetList">重置</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section>
      <addRole ref="addRole" @handleRes="getList" />
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
  </el-row>
</template>

<script>
import { getRolesList, delRoles } from '@/api/system'
export default {
  name: 'roleList',
  components:{
    cTable: ()=> import("@/components/customTable.vue"),
    addRole: ()=> import("./add.vue"),
  },
  data() {
    return {
      timeGroup: '',
      searchFrom:{
        name: "",
        code: "",
        enableFlag: "",
        createTimeStart: "",
        createTimeEnd: ""
      },
      tableCol: [
        { label: '角色名称', prop: 'name' },
        { label: '角色编码', prop: 'code' },
        { label: '角色状态', width: 90, align: 'center', render: (h, data)=>{
          return <el-tag type={data.row.enableFlag ? 'success' : 'danger'}>{data.row.enableFlag ? '启用' : '禁用'}</el-tag>
        } },
        { label: '备注', prop: 'remark', tooltip: true },
        { label: '创建时间', prop: 'createTime', width: 160 },
        { label: "操作", width: 240, render: (h, data) => {
          const opeList = [{key: '数据权限', value: 'dataAccess'}, {key: '编辑', value: 'edit'}, {key: '删除', value: 'delete'}]
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
    this.getList();
  },
  methods: {
    // 表格高度
    calculateTbHeight(){
      return this.$refs.searchForm ? this.$utils.fullHeight() - this.$refs.searchForm.$el.offsetHeight - 220 : 300;
    },
    // 重置列表
    resetList(){
      this.$refs.searchForm.resetFields();
      this.timeGroup = "";
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
      searchForm.createTimeStart = this.timeGroup ? this.timeGroup[0] : "";
      searchForm.createTimeEnd = this.timeGroup ? this.timeGroup[1] : "";
      searchForm.enableFlag = searchForm.enableFlag === "" ? "" : Boolean(searchForm.enableFlag);
      this.$utils.showLoading(true);
      getRolesList(this.pager.pageIndex, this.pager.pageSize, searchForm).then((res) => {
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
        case 'dataAccess':
          this.$message.error();('此功能未有')
          break;
        case 'edit':
          this.$refs.addRole.triggerModal(row)
          break;
        case 'delete':
          this.confirmDelete(row)
          break;
      }
    },
    // 确认删除
    confirmDelete(rowData) {
      const _this = this;
      this.$confirm('是否确定删除？', '删除', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        _this.$utils.showLoading(true);
        delRoles(rowData.id).then((res) => {
          if (res.data.success) {
            _this.$message.success('删除成功')
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

</style>
