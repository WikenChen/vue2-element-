<template>
  <el-row class="pd20">
    <section>
      <addMenu ref="addMenu" :treeData="tableData" @handleRes="getList" />
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
import { getPermissionTree, delPermission } from '@/api/system';
export default {
  name: 'menuList',
  components:{
    cTable: ()=> import("@/components/customTable.vue"),
    addMenu: ()=> import("./add.vue")
  },
  data() {
    return {
      tableCol: [
        { label: '菜单名称', prop: 'name' },
        { label: '排序', prop: 'sortNo',width: 80 },
        { label: '请求方式', prop: 'httpMethod',width: 80 },
        { label: '请求地址', prop: 'routeUrl', tooltip: true },
        { label: '授权url', prop: 'permitUrl', tooltip: true },
        { label: '类型', width: 80, align: 'center', render: (h, data)=>{
          return <el-tag effect="dark" type={data.row.type === 'menu' ? 'info' : data.row.type === 'catalog' ? 'success' : ''}>{data.row.type === 'menu' ? '菜单' : data.row.type === 'catalog' ? '目录' : '按钮'}</el-tag>
        } },
        { label: '可见', width: 80, align: 'center', render: (h, data)=>{
          return <el-tag type={data.row.visibleFlag ? 'success' : 'error'}>{data.row.visibleFlag ? '显示' : '隐藏'}</el-tag>
        }  },
        { label: '创建时间', prop: 'createTime', width: 160 },
        { label: "操作", width: 210, render: (h, data) => {
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
      getPermissionTree().then((res) => {
        this.$utils.showLoading(false);
        if (res.success) {
          this.parseData(res.data.data || []); //递归组装数据
          this.tableData = res.data.data || [];
        }
      })
    },
    // 递归数据
    parseData(arr, flag = []){
      let s = JSON.parse(JSON.stringify(flag));
      arr.forEach(item=>{
        if(item.parentId){
          s.push(item.parentId);
          item['parentIdArr'] = s;
        }else{
          item['parentIdArr'] = [];
        }
        if(item.children?.length){
          this.parseData(item.children, s);
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
          this.$refs.addMenu.triggerModal(rowData, type)
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
        delPermission(rowData.id).then((res) => {
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
