<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>任务列表</span>
          <el-button type="primary" @click="handleAdd">新增任务</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="任务标题" min-width="200" />
        <el-table-column prop="assignee" label="负责人" width="100" />
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="priorityColorMap[row.priority]">{{ priorityMap[row.priority] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="截止日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusColorMap[row.status]">{{ statusMap[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const priorityMap = { high: '高', medium: '中', low: '低' }
const priorityColorMap = { high: 'danger', medium: 'warning', low: 'info' }
const statusMap = { todo: '待办', doing: '进行中', done: '已完成' }
const statusColorMap = { todo: 'info', doing: '', done: 'success' }

const tableData = ref([
  { id: 1, title: '更新万绿湖产品包信息', assignee: '张三', priority: 'high', dueDate: '2024-03-20', status: 'doing' },
  { id: 2, title: '审核新提交的内容', assignee: '李四', priority: 'medium', dueDate: '2024-03-18', status: 'todo' },
  { id: 3, title: '联系活动场地', assignee: '王五', priority: 'high', dueDate: '2024-03-17', status: 'done' },
  { id: 4, title: '整理用户反馈', assignee: '赵六', priority: 'low', dueDate: '2024-03-25', status: 'todo' }
])

const handleAdd = () => { ElMessage.info('新增任务功能开发中') }
const handleEdit = (row) => { ElMessage.info(`编辑任务: ${row.title}`) }
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该任务吗？', '提示', { type: 'warning' }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) tableData.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.page-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>