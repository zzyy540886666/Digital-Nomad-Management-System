import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据看板' }
      },
      {
        path: 'packages',
        name: 'Packages',
        component: () => import('@/views/packages/index.vue'),
        meta: { title: '产品包管理' }
      },
      {
        path: 'events',
        name: 'Events',
        component: () => import('@/views/events/index.vue'),
        meta: { title: '活动管理' }
      },
      {
        path: 'pois',
        name: 'Pois',
        component: () => import('@/views/pois/index.vue'),
        meta: { title: '点位管理' }
      },
      {
        path: 'posts',
        name: 'Posts',
        component: () => import('@/views/posts/index.vue'),
        meta: { title: '内容审核' }
      },
      {
        path: 'leads',
        name: 'Leads',
        component: () => import('@/views/leads/index.vue'),
        meta: { title: '线索管理' }
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: () => import('@/views/tasks/index.vue'),
        meta: { title: '任务管理' }
      },
      {
        path: 'groups',
        name: 'Groups',
        component: () => import('@/views/groups/index.vue'),
        meta: { title: '社群管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '管理后台'} - 数字游民旅居生态`
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router