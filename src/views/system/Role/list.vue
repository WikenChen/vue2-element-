<template>
  <a-row>
    <section class="search-group">
      <a-form layout="inline" :form="form" autocomplete="off">
        <a-dropdown :trigger="['click']" :visible="accurateSearch">
          <a-button class="mr10" type="primary" @click="accurateSearch = !accurateSearch">
            精准搜索
            <a-icon type="down" />
          </a-button>
          <a-col slot="overlay" class="pt20 pl20 pr10">
            <a-form-item class="w-200 mr10">
              <a-input v-decorator="['code']" placeholder="请输入角色编码" />
            </a-form-item>
            <a-form-item class="w-200 mr10">
              <a-select v-decorator="['enableFlag']" placeholder="请选择状态" class="w-200" allowClear>
                <a-select-option :value="'true'">启用</a-select-option>
                <a-select-option :value="'false'">禁用</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="w-200 mr10">
              <a-date-picker show-time format="YYYY-MM-DD HH:mm:ss" v-decorator="['createTimeStart']" placeholder="请输入开始时间"/>
            </a-form-item>
            <a-form-item class="w-200 mr10">
              <a-date-picker show-time format="YYYY-MM-DD HH:mm:ss" v-decorator="['createTimeEnd']" placeholder="请输入结束时间"/>
            </a-form-item>
          </a-col>
        </a-dropdown>
        <a-form-item>
          <a-input v-decorator="['name']" placeholder="请输入角色名称" class="w-200" />
        </a-form-item>
        <a-button type="primary" @click="searchList">查询</a-button>
        <a-button class="ml10" @click="resetList">重置</a-button>
      </a-form>
    </section>
    <section class="mt10">
      <addRole ref="addRole" @handleRes="fetch" class="dib" />
    </section>
    <section class="pb10 mt10 border-table" :style="`height: ${tableHeight}px`">
      <customTable
        :tableData="tableData"
        :tableCol="tableCol"
        :pager="pager"
        :tableHeight="tableHeight"
        @changePage="handleChangeSize"
      >
        <span slot="enableFlag" slot-scope="row">
          <a-tag :color="row.enableFlag ? 'green' : 'red'" style="margin-right: 0">
            {{ row.enableFlag ? '启用' : '禁用' }}
          </a-tag>
        </span>
        <span slot="remark" slot-scope="row">
          {{ row.remark ? row.remark : '--' }}
        </span>
        <span slot="ope" slot-scope="row">
          <a-button type="primary" size="small" class="mr5" @click="operateGroup('data', row)">数据权限</a-button>
          <a-button type="primary" size="small" class="mr5" @click="operateGroup('edit', row)">编辑</a-button>
          <a-button type="danger" size="small" @click="operateGroup('delete', row)">删除</a-button>
        </span>
      </customTable>
    </section>
    <addData ref="addData" @handleRes="fetch"/>
  </a-row>
</template>

<script>
import { getRolesList, delRoles } from '@/api/system'
import { pagerOpt } from '@/utils/util'

export default {
  components: {
    customTable: () => import('@/components/customTable/index.vue'),
    addRole: () => import('./add.vue'),
    addData: () => import('./addData.vue'),
  },
  data() {
    return {
      // loading: true,
      accurateSearch: false,
      pager: pagerOpt(),
      form: this.$form.createForm(this),
      tableHeight: window.innerHeight - 275,
      // 表头
      tableCol: [
        { title: '角色名称', dataIndex: 'name' },
        { title: '角色编码', dataIndex: 'code' },
        { title: '角色状态', scopedSlots: { customRender: 'enableFlag' }, width: 90, align: 'center' },
        { title: '备注', scopedSlots: { customRender: 'remark' }, ellipsis: true },
        { title: '创建时间', dataIndex: 'createTime', width: 160 },
        { title: '操作', scopedSlots: { customRender: 'ope' }, width: 210 },
      ],
      tableData: [],
    }
  },

  created() {
    this.fetch()
  },
  methods: {
    // 请求列表
    fetch() {
      let data = this.form.getFieldsValue()
      data.enableFlag = data.enableFlag === 'true' ? true : data.enableFlag === 'false' ? false : ''
      data.createTimeStart = data.createTimeStart ? this.$formater(data.createTimeStart) : ''
      data.createTimeEnd = data.createTimeEnd ? this.$formater(data.createTimeEnd) : ''
      if(data.createTimeStart > data.createTimeEnd) return this.$message.warning('开始时间不能大于结束时间')
      this.accurateSearch = false
      this.$store.dispatch('commitLoading', true)
      getRolesList(this.pager.pageIndex, this.pager.pageSize, data).then((res) => {
        this.$store.dispatch('commitLoading', false)
        if (res.success) {
          this.tableData = res.data.data.resultList
          this.pager.totalItems = res.data.data.total
        }
      })
    },
    // 功能组
    operateGroup(type, rowData) {
      this.accurateSearch = false
      document.activeElement.blur()
      switch (type) {
        case 'data':
          this.$refs.addData.triggerModal(rowData);
          break
        case 'edit':
          if (rowData.id) {
            this.$refs.addRole.triggerModal(rowData, 'edit');
          } else {
            this.$refs.addRole.triggerModal(rowData);
          }
          break
        case 'delete':
          this.confirmDelete(rowData);
          break
      }
    },
    handleChangeSize(pageIndex, pageSize) {
      this.pager.pageIndex = pageIndex.pageIndex
      this.pager.pageSize = pageIndex.pageSize
      this.fetch()
    },
    // 确认删除
    confirmDelete(rowData) {
      let _this = this
      this.$confirm({
        title: '删除',
        content: '是否确定删除？',
        onOk() {
          _this.$store.dispatch('commitLoading', true)
          delRoles(rowData.id).then((res) => {
            if (res.data.success) {
              _this.$message.success('删除成功')
              _this.fetch()
            } else {
              _this.$store.dispatch('commitLoading', false)
            }
          })
        },
        onCancel() {},
      })
    },
    // 搜索
    searchList() {
      this.pager.pageIndex = 1
      this.fetch()
    },
    // 重置
    resetList() {
      this.form.resetFields()
      this.pager = pagerOpt()
      this.fetch()
    },
  },
}
</script>

<style lang="less" scoped>
.search-group {
  .ant-dropdown {
    right: 0;
  }
}
</style>
