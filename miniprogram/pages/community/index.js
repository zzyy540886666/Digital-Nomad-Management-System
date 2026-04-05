const api = require('../../api/index')
const { showToast, navigateTo, showLoading, hideLoading } = require('../../utils/index')

Page({
  data: {
    groups: [],
    tasks: [],
    showQrModal: false,
    currentGroup: {},
    categoryText: {
      consulting: '顾问',
      workshop: '工作坊',
      volunteer: '志愿',
      project: '项目'
    }
  },

  onLoad() {
    this.loadData()
  },

  async loadData() {
    try {
      showLoading()
      const [groupsData, tasksData] = await Promise.all([
        api.community.getGroups(),
        api.community.getTasks({ pageSize: 5 })
      ])
      this.setData({
        groups: groupsData.list || groupsData || [],
        tasks: tasksData.list || []
      })
    } catch (error) {
      showToast('加载失败，请重试')
    } finally {
      hideLoading()
    }
  },

  onJoinGroup(e) {
    const item = e.currentTarget.dataset.item
    this.setData({ showQrModal: true, currentGroup: item })

    const app = getApp()
    app.trackEvent('join_group_click', { groupId: item.id })
  },

  onCloseQrModal() {
    this.setData({ showQrModal: false })
  },

  preventMove() {},

  onTaskDetail(e) {
    const id = e.currentTarget.dataset.id
    navigateTo(`/pages/community/task-detail/index?id=${id}`)
  },

  onViewMoreTasks() {
    navigateTo('/pages/community/task-detail/index?list=true')
  }
})
