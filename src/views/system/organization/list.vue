<template>
  <el-row class="pd20">
    <section>
      <addOrganization ref="addOrganization" @handleRes="getList" />
    </section>
    <section class="mt10">
      <cTable 
        :showPagination="false"
        :table-list="tableData" 
        :table-col="tableCol" 
        :height="calculateTbHeight()"></cTable>
    </section>
  </el-row>
</template>

<script>
import { getOrgTree, delOrganizations } from '@/api/system';
export default {
  name: 'organizationList',
  components:{
    cTable: ()=> import("@/components/customTable.vue"),
    addOrganization: ()=> import("./add.vue")
  },
  data() {
    return {
      tableCol: [
        { label: '名称', prop: 'name' },
        { label: '编码', prop: 'code', render: (h, data)=>{
          return <el-link type="primary" underline={false} onClick={() => { this.opeGroup(data.row, 'view'); }}>{data.row.code}</el-link>
        }  },
        { label: '状态', width: 90, align: 'center', render: (h, data)=>{
          return <el-tag type={data.row.enableFlag ? 'success' : 'danger'}>{data.row.enableFlag ? '启用' : '禁用'}</el-tag>
        } },
        { label: '上级部门ID', prop: 'parentId' },
        { label: '创建时间', prop: 'createTime', width: 160 },
        { label: "操作", width: 240, render: (h, data) => {
          const opeList = [{key: '添加', value: 'addDetail'}, {key: '编辑', value: 'edit'}, {key: '删除', value: 'delete'}]
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
    };
  },
  mounted(){
    this.getList();
  },
  methods: {
    // 表格高度
    calculateTbHeight(){
      return this.$utils.fullHeight() - 190;
    },
    // 获取列表
    getList(){
      this.$utils.showLoading(true);
      this.tableData.splice(0);
      getOrgTree().then((res) => {
        this.$utils.showLoading(false);
        if (res.success) {
          this.tableData = res.data.data || [];
        }
      })
    },
    // 操作组
    opeGroup(rowData, type) {
      document.activeElement.blur() //取消默认聚焦
      switch(type){
        case 'addDetail':
        case 'edit':
        case 'view':
          this.$refs.addOrganization.triggerModal(rowData, type)
          break;
        case 'delete':
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
        delOrganizations(rowData.id).then((res) => {
          if (res.data.success) {
            _this.$message.success('删除成功')
            _this.getList()
          } else {
            _this.$utils.showLoading(false);
          }
        })
      }).catch(()=>{})
    }
  },
}
</script>

<style lang="less" scoped>

</style>
