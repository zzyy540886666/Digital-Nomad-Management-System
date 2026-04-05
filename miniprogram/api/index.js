const app = getApp()

const request = (options) => {
  return app.request(options)
}

const api = {
  auth: {
    wxLogin: (jsCode) => request({ url: '/auth/wx-login', method: 'POST', data: { jsCode } }),
    getMe: () => request({ url: '/me' }),
    updateProfile: (data) => request({ url: '/me/profile', method: 'PUT', data })
  },

  home: {
    getHomeData: () => request({ url: '/home' }),
    getBanners: () => request({ url: '/home/banners' })
  },

  packages: {
    getList: (params) => request({ url: '/packages', data: params }),
    getDetail: (id) => request({ url: `/packages/${id}` }),
    submitLead: (data) => request({ url: '/package-leads', method: 'POST', data }),
    getMyLeads: () => request({ url: '/me/package-leads' })
  },

  events: {
    getList: (params) => request({ url: '/events', data: params }),
    getDetail: (id) => request({ url: `/events/${id}` }),
    signup: (id) => request({ url: `/events/${id}/signup`, method: 'POST' }),
    cancel: (id) => request({ url: `/events/${id}/cancel`, method: 'POST' }),
    getMySignups: () => request({ url: '/me/event-signups' }),
    checkin: (id) => request({ url: `/events/${id}/checkin`, method: 'POST' })
  },

  guides: {
    getList: () => request({ url: '/guides' }),
    getPois: (params) => request({ url: '/pois', data: params }),
    getPoiDetail: (id) => request({ url: `/pois/${id}` })
  },

  posts: {
    getList: (params) => request({ url: '/posts', data: params }),
    getDetail: (id) => request({ url: `/posts/${id}` }),
    create: (data) => request({ url: '/posts', method: 'POST', data }),
    match: (id, data) => request({ url: `/posts/${id}/match`, method: 'POST', data }),
    getMyPosts: () => request({ url: '/me/posts' }),
    getMyMatches: () => request({ url: '/me/matches' })
  },

  community: {
    getGroups: () => request({ url: '/community-groups' }),
    getTasks: (params) => request({ url: '/tasks', data: params }),
    getTaskDetail: (id) => request({ url: `/tasks/${id}` }),
    signupTask: (id) => request({ url: `/tasks/${id}/signup`, method: 'POST' }),
    getMyTaskSignups: () => request({ url: '/me/task-signups' })
  },

  recommendations: {
    getHome: () => request({ url: '/recommendations/home' }),
    matchSuggest: (postId) => request({ url: '/match/suggest', method: 'POST', data: { postId } })
  },

  ai: {
    guideChat: (query, context) => request({ url: '/ai/guide-chat', method: 'POST', data: { query, context } })
  }
}

module.exports = api
