<template>
  <a-row>
    <section class="search-group">
      <a-form layout="inline" :form="form" autocomplete="off">
        <a-form-item>
          <a-input v-decorator="['name']" placeholder="请输入名称" class="w-200" />
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['code']" placeholder="请输入编码" class="w-200" />
        </a-form-item>
        <a-form-item>
          <a-select v-decorator="['enable']"  placeholder="请选择状态" class="w-200" allowClear>
            <a-select-option :value="'true'">启用</a-select-option>
            <a-select-option :value="'false'">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-button type="primary" @click="searchList">搜索</a-button>
        <a-button @click="resetList" class="ml10">重置</a-button>
      </a-form>
    </section>
    <section class="mt10">
      <addDictionary ref="addDictionary" @handleRes="getList" class="dib"/>
      <a-button type="primary" @click="unfoldList" class="ml10">展开所有</a-button>
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
        <span slot="enable" slot-scope="text,row">
          <a-tag :color="row.enable  ? 'green' : 'red'" style="margin-right: 0;">
            {{ row.enable ? '启用' : '禁用' }}
          </a-tag>
        </span>
        <span slot="ope" slot-scope="text,row">
          <a-button type="primary" size="small" class="mr5" @click="operateGroup('addDetail', row)">添加明细</a-button>
          <a-button type="primary" size="small" class="mr5" @click="operateGroup('edit', row)">编辑</a-button>
          <a-button type="danger" size="small" @click="operateGroup('delete', row)">删除</a-button>
        </span>
      </a-table>
    </section>
    <section class="mt10 fr">
      <a-pagination
        show-size-changer
        showQuickJumper
        :default-current="pager.pageIndex"
        :pageSize="pager.pageSize"
        :total="pager.totalItems"
        :pageSizeOptions="pager.pageOpt"
        @showSizeChange="handleChangeSize"
        @change="handleChangeSize"
      />
    </section>
    <addDictionaryDetail ref="addDictionaryDetail" @handleRes="getList"/>
    <!-- <customTable 
      :tableData="tableData" 
      :tableCol="tableCol" 
      :pager="pager" 
      :tableHeight="tableHeight"
      @changePage="handleChangeSize"
      @expandFn="expandFn"
      :expandedKeys="expandedKeys"
      >
      <span slot="enable" slot-scope="row">
				<a-tag :color="row.enable  ? 'green' : 'red'" style="margin-right: 0;">
					{{ row.enable ? '启用' : '禁用' }}
				</a-tag>
			</span>
      <span slot="ope" slot-scope="row">
				<a-button type="primary" size="small" class="mr5" @click="operateGroup('addDetail', row)">添加明细</a-button>
				<a-button type="primary" size="small" class="mr5" @click="operateGroup('edit', row)">编辑</a-button>
        <a-button type="danger" size="small" @click="operateGroup('delete', row)">删除</a-button>
			</span>
    </customTable> -->
  </a-row>
</template>

<script>
import { getDictList, deleteDictionay, deleteDictionayDetail, getDictionaryDetailById } from '@/api/system'
import { pagerOpt } from '@/utils/util'
export default {
  name: 'dictionaryList',
  components:{
    customTable: () => import('@/components/customTable/index.vue'),
    addDictionary: () => import('./add.vue'),
    addDictionaryDetail: () => import('./addDetail.vue'),
  },
  data() {
    return {
      form: this.$form.createForm(this),
      pager: pagerOpt(),
      tableData: [],
      tableCol: [
        { title: '名称', dataIndex: 'name' },
        { title: '编码', dataIndex: 'code' },
        { title: '状态', scopedSlots: { customRender: 'enable' }, width: 90, align: 'center' },
        { title: '备注', dataIndex: 'remark', ellipsis: true },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        { title: '操作', scopedSlots: { customRender: 'ope' }, width: 210 },
      ],
      tableHeight: window.innerHeight - 275,
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
      let data = this.form.getFieldsValue();
      data.enable = data.enable === 'true' ? true : data.enable === 'false' ? 'false' : ""
      this.$store.dispatch('commitLoading', true);
      this.expandedKeys = []
      getDictList(this.pager.pageIndex, this.pager.pageSize, data).then(res=>{
        this.$store.dispatch('commitLoading', false);
        this.tableData.splice(0)
        if(res.success){
          this.tableData = res.data.data.resultList.map(item=>{
            item.children = [];
            return item;
          });
          this.pager.totalItems = res.data.data.total;
        }
      })
    },
    // 点击表格展开行
    expandFn(expanded, record){
      if(expanded){
        if(!this.expandedKeys.some(item=>item === record.id)){
          this.expandedKeys.push(record.id)
        }

        // 如果children没有数据且为最顶级的，请求明细api  (dictId只有非最顶级才有值)
        if(!record.dictId && record.children.length < 1){
          this.$store.dispatch('commitLoading', true);
          getDictionaryDetailById(record.id).then(res=>{
            this.$store.dispatch('commitLoading', false);
            if(res.success){
              if(res.data.data.children.length < 1){
                this.$nextTick(()=>{
                  this.$delete(record, 'children')
                })
              }else{
                this.parseData(res.data.data.children)
                record.children = res.data.data.children;
              }
            }
          })
        }
      }else{
        this.expandedKeys = this.expandedKeys.filter(v => v != record.id)
      }
    },
    // 递归数据
    parseData(arr, isNone){
      arr.forEach(item=>{
        if(isNone && item.children){
          //展开所有列表树形
          this.expandFn(true, item)
        }

        // 将没有children的展开行符号隐藏
        if(item.children?.length){
          this.parseData(item.children)
        }else{
          if(!isNone && item.children){
            delete item.children
          }
        }
      })
    },
    // 功能组
    operateGroup(type, rowData){
      document.activeElement.blur();
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
    confirmDelete(rowData){
      let _this = this;
      this.$confirm({
        title: '删除',
        content: '是否确定删除？',
        onOk() {
          _this.$store.dispatch('commitLoading', true);
          let request = rowData.dictId ? deleteDictionayDetail(rowData.id) : deleteDictionay(rowData.id)
          request.then(res => {
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
