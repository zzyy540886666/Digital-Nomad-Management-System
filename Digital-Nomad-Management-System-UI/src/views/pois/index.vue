<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="搜索点位名称" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="全部类型" clearable>
            <el-option label="住宿" value="accommodation" />
            <el-option label="餐饮" value="food" />
            <el-option label="交通" value="transport" />
            <el-option label="景点" value="attraction" />
            <el-option label="医疗" value="medical" />
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
          <span>点位列表</span>
          <el-button type="primary" @click="handleAdd">新增点位</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" min-width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeColorMap[row.type]">{{ typeMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
const searchForm = reactive({ keyword: '', type: '' })

const typeMap = { accommodation: '住宿', food: '餐饮', transport: '交通', attraction: '景点', medical: '医疗' }
const typeColorMap = { accommodation: '', food: 'success', transport: 'info', attraction: 'warning', medical: 'danger' }

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const tableData = ref([
  { id: 1, name: '河源万绿湖度假酒店', type: 'accommodation', address: '河源市东源县万绿湖风景区', rating: 4.5 },
  { id: 2, name: '客家大院餐厅', type: 'food', address: '河源市源城区客家文化街', rating: 4.8 },
  { id: 3, name: '河源汽车站', type: 'transport', address: '河源市源城区建设大道', rating: 4.0 },
  { id: 4, name: '万绿湖风景区', type: 'attraction', address: '河源市东源县万绿湖', rating: 4.9 },
  { id: 5, name: '河源市人民医院', type: 'medical', address: '河源市源城区文祥路', rating: 4.2 }
])

onMounted(() => { pagination.total = tableData.value.length })

const handleSearch = () => { pagination.page = 1 }
const handleReset = () => { searchForm.keyword = ''; searchForm.type = ''; handleSearch() }
const handleAdd = () => { ElMessage.info('新增点位功能开发中') }
const handleEdit = (row) => { ElMessage.info(`编辑点位: ${row.name}`) }
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该点位吗？', '提示', { type: 'warning' }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) { tableData.value.splice(index, 1); pagination.total = tableData.value.length }
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.search-card { margin-bottom: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.pagination-wrapper { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>