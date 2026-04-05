<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>社群列表</span>
          <el-button type="primary" @click="handleAdd">新增社群</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="社群名称" min-width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ typeMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="memberCount" label="成员数" width="100" />
        <el-table-column prop="owner" label="群主" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="primary" link @click="handleManage(row)">管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const typeMap = { wechat: '微信群', qq: 'QQ群', offline: '线下群' }

const tableData = ref([
  { id: 1, name: '河源数字游民交流群', type: 'wechat', memberCount: 256, owner: '管理员', createdAt: '2024-01-15' },
  { id: 2, name: '万绿湖旅居群', type: 'wechat', memberCount: 128, owner: '张三', createdAt: '2024-02-01' },
  { id: 3, name: '客家文化爱好者', type: 'wechat', memberCount: 89, owner: '李四', createdAt: '2024-02-15' },
  { id: 4, name: '周末徒步群', type: 'offline', memberCount: 45, owner: '王五', createdAt: '2024-03-01' }
])

const handleAdd = () => { ElMessage.info('新增社群功能开发中') }
const handleView = (row) => { ElMessage.info(`查看社群: ${row.name}`) }
const handleManage = (row) => { ElMessage.info(`管理社群: ${row.name}`) }
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>