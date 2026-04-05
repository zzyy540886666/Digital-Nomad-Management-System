<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索内容" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="全部类型" clearable>
            <el-option label="技能交换" value="skill" />
            <el-option label="生活分享" value="life" />
            <el-option label="问答求助" value="qa" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <template #header>
        <span>内容审核列表</span>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="author" label="发布者" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ typeMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="发布时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusColorMap[row.status]">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link @click="handleApprove(row)">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link @click="handleReject(row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchForm = reactive({ keyword: '', type: '', status: '' })
const typeMap = { skill: '技能交换', life: '生活分享', qa: '问答求助' }
const statusMap = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
const statusColorMap = { pending: 'warning', approved: 'success', rejected: 'danger' }
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const tableData = ref([
  { id: 1, title: '提供UI/UX设计服务', author: '设计师小王', type: 'skill', createdAt: '2024-03-15 10:30', status: 'pending' },
  { id: 2, title: '寻找摄影合作伙伴', author: '摄影爱好者', type: 'skill', createdAt: '2024-03-15 09:20', status: 'approved' },
  { id: 3, title: '河源租房攻略分享', author: '数字游民小张', type: 'life', createdAt: '2024-03-14 16:45', status: 'approved' },
  { id: 4, title: '求推荐靠谱的快递点', author: '新来游民', type: 'qa', createdAt: '2024-03-14 14:30', status: 'pending' }
])

onMounted(() => { pagination.total = tableData.value.length })

const handleSearch = () => { pagination.page = 1 }
const handleReset = () => { searchForm.keyword = ''; searchForm.type = ''; searchForm.status = ''; handleSearch() }
const handleView = (row) => { ElMessage.info(`查看内容: ${row.title}`) }
const handleApprove = (row) => {
  ElMessageBox.confirm('确定通过该内容吗？', '提示', { type: 'success' }).then(() => {
    row.status = 'approved'
    ElMessage.success('审核通过')
  }).catch(() => {})
}
const handleReject = (row) => {
  ElMessageBox.confirm('确定拒绝该内容吗？', '提示', { type: 'warning' }).then(() => {
    row.status = 'rejected'
    ElMessage.success('已拒绝')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.search-card { margin-bottom: 20px; }
.pagination-wrapper { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>