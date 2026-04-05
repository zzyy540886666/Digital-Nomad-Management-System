import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, logout, getProfile } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))

  const setToken = (val) => {
    token.value = val
    localStorage.setItem('admin_token', val)
  }

  const setUserInfo = (val) => {
    userInfo.value = val
    localStorage.setItem('admin_user', JSON.stringify(val))
  }

  const loginAction = async (credentials) => {
    const data = await login(credentials)
    setToken(data.token)
    setUserInfo(data.user)
    return data
  }

  const logoutAction = async () => {
    try { await logout() } catch (e) { console.error(e) }
    setToken('')
    setUserInfo(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  const getProfileAction = async () => {
    const data = await getProfile()
    setUserInfo(data)
    return data
  }

  return { token, userInfo, setToken, setUserInfo, loginAction, logoutAction, getProfileAction }
})
