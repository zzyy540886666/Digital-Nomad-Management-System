<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索线索" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="待跟进" value="pending" />
            <el-option label="跟进中" value="processing" />
            <el-option label="已成交" value="closed" />
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
        <span>线索列表</span>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="package" label="意向产品" min-width="180" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="createdAt" label="提交时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusColorMap[row.status]">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleFollow(row)">跟进</el-button>
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
import { ElMessage } from 'element-plus'

const loading = ref(false)
const searchForm = reactive({ keyword: '', status: '' })
const statusMap = { pending: '待跟进', processing: '跟进中', closed: '已成交' }
const statusColorMap = { pending: 'warning', processing: '', closed: 'success' }
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const tableData = ref([
  { id: 1, name: '张三', phone: '138****1234', package: '万绿湖深度旅居7日游', source: '小程序', createdAt: '2024-03-15 10:30', status: 'pending' },
  { id: 2, name: '李四', phone: '139****5678', package: '客家文化探索5日游', source: '小程序', createdAt: '2024-03-15 09:20', status: 'processing' },
  { id: 3, name: '王五', phone: '137****9012', package: '温泉养生度假3日游', source: '活动', createdAt: '2024-03-14 16:45', status: 'closed' },
  { id: 4, name: '赵六', phone: '136****3456', package: '乡村田园体验4日游', source: '分享', createdAt: '2024-03-14 14:30', status: 'pending' }
])

onMounted(() => { pagination.total = tableData.value.length })

const handleSearch = () => { pagination.page = 1 }
const handleReset = () => { searchForm.keyword = ''; searchForm.status = ''; handleSearch() }
const handleView = (row) => { ElMessage.info(`查看线索: ${row.name}`) }
const handleFollow = (row) => { ElMessage.info(`跟进线索: ${row.name}`) }
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.search-card { margin-bottom: 20px; }
.pagination-wrapper { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>