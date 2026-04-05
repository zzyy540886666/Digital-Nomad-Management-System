<template>
  <div class="dashboard-page">
    <div class="stats-row">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon" :style="{ background: stat.gradient }">
          <el-icon :size="28"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-title">{{ stat.title }}</div>
        </div>
        <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
          <el-icon><component :is="stat.trend > 0 ? 'Top' : 'Bottom'" /></el-icon>
          {{ Math.abs(stat.trend) }}%
        </div>
      </div>
    </div>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="bar-item" v-for="(item, index) in chartData" :key="index">
                <div class="bar" :style="{ height: item.value + '%' }"></div>
                <span class="label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>产品包分类</span>
          </template>
          <div class="pie-chart">
            <div class="pie-item" v-for="(item, index) in pieData" :key="index">
              <div class="pie-color" :style="{ background: item.color }"></div>
              <span class="pie-label">{{ item.name }}</span>
              <span class="pie-value">{{ item.value }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新线索</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentLeads" style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="package" label="意向产品" />
            <el-table-column prop="time" label="时间" width="100" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>近期活动</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentEvents" style="width: 100%">
            <el-table-column prop="title" label="活动名称" />
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="signups" label="报名" width="80" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const chartType = ref('week')

const stats = ref([
  { title: '总用户', value: '2,458', icon: 'User', gradient: 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)', trend: 12 },
  { title: '产品包', value: '36', icon: 'Box', gradient: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)', trend: 8 },
  { title: '活动数', value: '128', icon: 'Calendar', gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)', trend: -3 },
  { title: '线索数', value: '892', icon: 'TrendCharts', gradient: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)', trend: 25 }
])

const chartData = ref([
  { label: '周一', value: 60 },
  { label: '周二', value: 80 },
  { label: '周三', value: 45 },
  { label: '周四', value: 90 },
  { label: '周五', value: 70 },
  { label: '周六', value: 55 },
  { label: '周日', value: 85 }
])

const pieData = ref([
  { name: '自然风光', value: 12, color: '#4A90D9' },
  { name: '文化体验', value: 8, color: '#52c41a' },
  { name: '养生休闲', value: 6, color: '#722ed1' },
  { name: '户外探险', value: 5, color: '#fa8c16' },
  { name: '其他', value: 5, color: '#8c8c8c' }
])

const recentLeads = ref([
  { name: '张三', package: '万绿湖深度旅居7日游', time: '10分钟前' },
  { name: '李四', package: '客家文化探索5日游', time: '1小时前' },
  { name: '王五', package: '温泉养生度假3日游', time: '2小时前' },
  { name: '赵六', package: '乡村田园体验4日游', time: '3小时前' }
])

const recentEvents = ref([
  { title: '数字游民线下交流会', date: '2024-03-15', signups: '28/50' },
  { title: '客家美食烹饪体验课', date: '2024-03-16', signups: '15/20' },
  { title: '万绿湖徒步摄影活动', date: '2024-03-17', signups: '35/40' },
  { title: '远程工作效率分享会', date: '2024-03-18', signups: '120/200' }
])
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 20px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 16px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-title {
  font-size: 14px;
  color: #888;
  margin-top: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;

  &.up {
    color: #52c41a;
  }

  &.down {
    color: #ff4d4f;
  }
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  height: 360px;

  :deep(.el-card__body) {
    height: calc(100% - 60px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding-bottom: 20px;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  width: 100%;
  align-items: flex-end;
  height: 200px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  .bar {
    width: 40px;
    background: linear-gradient(180deg, #4A90D9 0%, #357ABD 100%);
    border-radius: 4px 4px 0 0;
    transition: height 0.3s;
  }

  .label {
    margin-top: 8px;
    font-size: 12px;
    color: #888;
  }
}

.pie-chart {
  padding: 20px 0;
}

.pie-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.pie-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 12px;
}

.pie-label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.pie-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}
</style>