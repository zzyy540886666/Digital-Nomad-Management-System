<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索活动名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="全部分类" clearable>
            <el-option label="社交" value="social" />
            <el-option label="文化" value="culture" />
            <el-option label="户外" value="outdoor" />
            <el-option label="共建" value="build" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="报名中" value="open" />
            <el-option label="已结束" value="closed" />
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
        <div class="card-header">
          <span>活动列表</span>
          <el-button type="primary" @click="handleAdd">新增活动</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="活动名称" min-width="200" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag>{{ categoryMap[row.category] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="活动时间" width="160" />
        <el-table-column prop="venue" label="地点" width="140" />
        <el-table-column prop="signups" label="报名" width="100">
          <template #default="{ row }">
            {{ row.signupCount }}/{{ row.capacity }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'open' ? 'success' : 'info'">
              {{ row.status === 'open' ? '报名中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleViewSignups(row)">报名列表</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchForm = reactive({
  keyword: '',
  category: '',
  status: ''
})

const categoryMap = {
  social: '社交',
  culture: '文化',
  outdoor: '户外',
  build: '共建'
}

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const tableData = ref([
  { id: 1, title: '数字游民线下交流会', category: 'social', date: '2024-03-15 14:00', venue: '河源创客空间', signupCount: 28, capacity: 50, status: 'open' },
  { id: 2, title: '客家美食烹饪体验课', category: 'culture', date: '2024-03-16 10:00', venue: '客家文化村', signupCount: 15, capacity: 20, status: 'open' },
  { id: 3, title: '万绿湖徒步摄影活动', category: 'outdoor', date: '2024-03-17 07:00', venue: '万绿湖风景区', signupCount: 35, capacity: 40, status: 'open' },
  { id: 4, title: '远程工作效率分享会', category: 'build', date: '2024-03-18 19:30', venue: '线上直播', signupCount: 120, capacity: 200, status: 'open' },
  { id: 5, title: '周末读书会', category: 'social', date: '2024-03-19 15:00', venue: '河源图书馆', signupCount: 18, capacity: 30, status: 'open' }
])

onMounted(() => {
  pagination.total = tableData.value.length
})

const handleSearch = () => {
  pagination.page = 1
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.category = ''
  searchForm.status = ''
  handleSearch()
}

const handleAdd = () => {
  ElMessage.info('新增活动功能开发中')
}

const handleEdit = (row) => {
  ElMessage.info(`编辑活动: ${row.title}`)
}

const handleViewSignups = (row) => {
  ElMessage.info(`查看报名列表: ${row.title}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      pagination.total = tableData.value.length
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>