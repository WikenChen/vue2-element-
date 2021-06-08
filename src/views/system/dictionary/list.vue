<template>
  <el-row class="pd20">
    <section class="search-form-contain">
      <el-form :inline="true" ref="searchForm" :model="searchFrom">
        <el-form-item prop="name">
          <el-input v-model="searchFrom.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="searchFrom.code" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item prop="enable">
          <el-select v-model="searchFrom.enable" clearable placeholder="状态">
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
      <addDict ref="addDictionary" @handleRes="getList" />
    </section>
    <section class="mt10">
      <cTable 
        :table-list="tableData" 
        :table-col="tableCol" 
        :pager="pager" 
        @handleChangeSize="changeSize"
        @handleChangePage="changePage" 
        @loadChildrenTable="loadChildrenTable"
        :height="calculateTbHeight()"></cTable>
    </section>
    <addDetail ref="addDictionaryDetail" @handleRes="getList" />
  </el-row>
</template>

<script>
import { getDictList, deleteDictionay, deleteDictionayDetail, getDictionaryDetailById } from '@/api/system';
export default {
  name: 'configList',
  components:{
    cTable: ()=> import("@/components/customTable.vue"),
    addDict: ()=> import("./add.vue"),
    addDetail: ()=> import("./addDetail.vue"),
  },
  data() {
    return {
      searchFrom:{
        name: "",
        code: "",
        enable: "",
      },
      tableCol: [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'code' },
        { label: '状态', width: 90, align: 'center', render: (h, data)=>{
          return <el-tag type={data.row.enable ? 'success' : 'danger'}>{data.row.enable ? '启用' : '禁用'}</el-tag>
        } },
        { label: '备注', prop: 'remark', tooltip: true },
        { label: '创建时间', prop: 'createTime', width: 160 },
        { label: "操作", width: 240, render: (h, data) => {
          const opeList = [{key: '添加明细', value: 'addDetail'}, {key: '编辑', value: 'edit'}, {key: '删除', value: 'delete'}]
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
      searchForm.enable = searchForm.enable === "" ? "" : Boolean(searchForm.enable);
      this.$utils.showLoading(true);
      this.tableData.splice(0);
      getDictList(this.pager.pageIndex, this.pager.pageSize, searchForm).then((res) => {
        this.$utils.showLoading(false);
        if (res.success) {
          this.tableData = res.data.data.resultList.map(item=>{
            // item.children = [];
            item.hasChildren = true //出现箭头 可以点击加载
            return item;
          });
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
    opeGroup(rowData, type) {
      document.activeElement.blur() //取消默认聚焦
      switch(type){
        case 'addDetail':
          this.$refs.addDictionaryDetail.triggerModal(rowData)
          break;
        case 'edit':
          if(rowData.dictId){
            this.$refs.addDictionaryDetail.triggerModal(rowData, 'edit')
          }else{
            this.$refs.addDictionary.triggerModal(rowData)
          }
          break;
        case 'delete':
          if(rowData.systemFlag){
            this.$message.warning('当前数据字典为系统内置，不能删除！')
            return;
          }
          this.confirmDelete(rowData)
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
        let request = rowData.dictId ? deleteDictionayDetail(rowData.id) : deleteDictionay(rowData.id)
        request.then((res) => {
          if (res.data.success) {
            _this.$message.success('删除成功')
            _this.getList()
          } else {
            _this.$utils.showLoading(false);
          }
        })
      }).catch(()=>{})
    },
    //展开后回调方法
    loadChildrenTable(tree, treeNode, resolve){
      if(tree.dictId){
        resolve(tree.children);
        return;
      }
      getDictionaryDetailById(tree.id).then(res=>{
        if(res.success){
          this.parseData(res.data.data.children)
          resolve(res.data.data.children);
        }
      })
    },
    // 递归数据
    parseData(arr){
      arr.forEach(item=>{
        if(item.children.length){
          item.hasChildren = true;
          this.parseData(item.children)
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>

</style>
