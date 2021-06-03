<template>
  <a-row>
    <section>
      <addOrganzation ref="addOrganzation" @handleRes="getList" class="dib"/>
    </section>
    <section class="pb10 mt10 border-table" :style="`height: ${tableHeight}px`">
      <a-table ref="table" size="small" 
        row-key="id" 
        :pagination="false" 
        :data-source="tableData" 
        :columns="tableCol" 
        :scroll="{y:tableHeight - 60}"
        :expandedRowKeys="expandedKeys"
        @expand="expandFn"
      >
        <a slot="code" slot-scope="text,row" @click="operateGroup('view', row)">{{row.code}}</a>
        <span slot="enable" slot-scope="text,row">
          <a-tag :color="row.enableFlag  ? 'green' : 'red'" style="margin-right: 0;">
            {{ row.enableFlag ? '是' : '否' }}
          </a-tag>
        </span>
        <span slot="ope" slot-scope="text,row">
          <a-button type="primary" size="small" class="mr5" @click="operateGroup('addDetail', row)">添加</a-button>
          <a-button type="primary" size="small" class="mr5" @click="operateGroup('edit', row)">编辑</a-button>
          <a-button type="danger" size="small" @click="operateGroup('delete', row)">删除</a-button>
        </span>
      </a-table>
    </section>
  </a-row>
</template>

<script>
import { getOrgTree, delOrganizations } from '@/api/system'
import { pagerOpt } from '@/utils/util'
export default {
  name: 'organzationList',
  components:{
    addOrganzation: () => import('./add.vue'),
  },
  data() {
    return {
      form: this.$form.createForm(this),
      pager: pagerOpt(),
      tableData: [],
      tableCol: [
        { title: '名称', dataIndex: 'name' },
        { title: '编码', scopedSlots: { customRender: 'code' } },
        { title: '是否正常', scopedSlots: { customRender: 'enable' }, width: 90, align: 'center' },
        { title: '上级部门ID', dataIndex: 'parentId' },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        { title: '操作', scopedSlots: { customRender: 'ope' }, width: 200 },
      ],
      tableHeight: window.innerHeight - 180,
      expandedKeys: []  //展开行数据
    }
  },
  methods:{
    // 搜索 页数置为1
    searchList(){
      this.pager.pageIndex = 1;
      this.getList()
    },
    //重置
    resetList(){
      this.form.resetFields();
      this.pager = pagerOpt();
      this.getList();
    },
    handleChangeSize(pageIndex, pageSize) {
      this.pager.pageIndex = pageIndex;
      this.pager.pageSize = pageSize;
      this.getList();
    },
    //请求列表
    getList(){
      this.$store.dispatch('commitLoading', true);
      this.expandedKeys = []
      getOrgTree().then(res=>{
        this.$store.dispatch('commitLoading', false);
        this.tableData.splice(0)
        if(res.success){
          this.tableData = res.data.data;
        }
      })
    },
    // 点击表格展开行
    expandFn(expanded, record){
      if(expanded){
        if(!this.expandedKeys.some(item=>item === record.id)){
          this.expandedKeys.push(record.id)
        }
      }else{
        this.expandedKeys = this.expandedKeys.filter(v => v != record.id)
      }
    },
    // 递归数据
    parseData(arr){
      arr.forEach(item=>{
        if(item.children){
          //展开所有列表树形
          this.expandFn(true, item)
        }
      })
    },
    // 功能组
    operateGroup(type, rowData){
      document.activeElement.blur()
      switch(type){
        case 'addDetail':
        case 'edit':
        case 'view':
          this.$refs.addOrganzation.triggerModal(rowData, type)
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
    confirmDelete(rowData){
      let _this = this;
      this.$confirm({
        title: '删除',
        content: '是否确定删除？',
        onOk() {
          _this.$store.dispatch('commitLoading', true);
          delOrganizations(rowData.id).then(res => {
            if(res.data.success){
              _this.$message.success('删除成功');
              _this.getList()
            }else{
              _this.$store.dispatch('commitLoading', false);
            }
          })
        },
        onCancel() {},
      });
    },
    // 展开表格所有树形节点
    unfoldList(){
      this.parseData(this.tableData, true)
    }
  },
  mounted(){
    this.getList()
  }
}
</script>
<style scoped>
  
</style>
