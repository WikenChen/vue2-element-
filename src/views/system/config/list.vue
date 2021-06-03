<template>
  <el-row class="pd20">
    <section class="search-form-contain">
      <el-form :inline="true" ref="searchForm" :model="searchFrom">
        <el-form-item prop="name">
          <el-input v-model="searchFrom.name" placeholder="配置名称"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="searchFrom.code" placeholder="配置编码"></el-input>
        </el-form-item>
        <el-form-item prop="tenantId">
          <el-select v-model="searchFrom.tenantId" placeholder="租户" clearable>
            <el-option v-for="item in tenantsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="enableFlag" clearable>
          <el-select v-model="searchFrom.enableFlag" placeholder="状态">
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
      <addConfig ref="addConfig" :tenantsList="tenantsList" @handleRes="getList" />
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
import { getTenants, getGeneralConfigs, delGeneralConfigs } from '@/api/system';
export default {
  name: 'configList',
  components:{
    cTable: ()=> import("@/components/customTable.vue"),
    addConfig: ()=> import("./add.vue"),
  },
  data() {
    return {
      timeGroup: '',
      tenantsList: [],
      searchFrom:{
        name: "",
        code: "",
        enableFlag: "",
        createTimeStart: "",
        createTimeEnd: ""
      },
      tableCol: [
        { label: '租户名称', prop: 'tenantName' },
        { label: '配置名称', prop: 'name' },
        { label: '配置编码', prop: 'code' },
        { label: '配置键值', prop: 'value'},
        { label: '状态', width: 90, align: 'center', render: (h, data)=>{
          return <el-tag type={data.row.enableFlag ? 'success' : 'danger'}>{data.row.enableFlag ? '启用' : '禁用'}</el-tag>
        } },
        { label: '系统内置', prop: 'systemFlag', width: 90, align: 'center', render: (h, data)=>{
          return <el-tag type={data.row.systemFlag ? 'success' : 'danger'}>{data.row.systemFlag ? '是' : '否'}</el-tag>
        } },
        { label: '创建时间', prop: 'createTime', width: 160 },
        { label: '备注', prop: 'remark', tooltip: true },
        { label: "操作", width: 160, render: (h, data) => {
          const opeList = [{key: '编辑', value: 'edit'}, {key: '删除', value: 'delete'}]
            return opeList.map( item =>
              <el-button 
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
    this._getTenants();
    this.getList();
  },
  methods: {
    // 获取租户列表下拉
    _getTenants() {
      getTenants(1, Infinity).then(res => {
        if (res.success) {
          this.tenantsList = res.data.data.resultList || [];
        }
      })
    },
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
      getGeneralConfigs(this.pager.pageIndex, this.pager.pageSize, searchForm).then((res) => {
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
          this.$refs.addConfig.triggerModal(row)
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
        delGeneralConfigs(rowData.id).then((res) => {
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
