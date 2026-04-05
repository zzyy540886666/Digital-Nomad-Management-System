const database = require('../db/database')

const User = {
  findById: async (id) => {
    return database.queryOne('SELECT * FROM users WHERE id = ?', [id])
  },

  findByOpenid: async (openid) => {
    return database.queryOne('SELECT * FROM users WHERE openid = ?', [openid])
  },

  create: async (data) => {
    const result = await database.insert('users', {
      openid: data.openid,
      nickname: data.nickname || '微信用户',
      avatar_url: data.avatar_url || '',
      created_at: new Date(),
      updated_at: new Date()
    })
    return { id: result.insertId, ...data }
  },

  updateProfile: async (userId, data) => {
    // 处理数组字段，转换为 JSON 字符串
    const profileData = { ...data }
    if (Array.isArray(profileData.skills)) {
      profileData.skills = JSON.stringify(profileData.skills)
    }
    if (Array.isArray(profileData.interests)) {
      profileData.interests = JSON.stringify(profileData.interests)
    }
    
    // 移除不属于 user_profiles 表的字段
    delete profileData.nickname
    delete profileData.avatarUrl
    
    const profile = await database.queryOne('SELECT * FROM user_profiles WHERE user_id = ?', [userId])
    if (profile) {
      await database.update('user_profiles', { ...profileData, updated_at: new Date() }, 'user_id = ?', [userId])
    } else {
      await database.insert('user_profiles', { user_id: userId, ...profileData, created_at: new Date(), updated_at: new Date() })
    }
    
    const result = await database.queryOne('SELECT * FROM user_profiles WHERE user_id = ?', [userId])
    
    // 解析 JSON 字段
    if (result) {
      try {
        result.skills = result.skills ? JSON.parse(result.skills) : []
      } catch (e) {
        result.skills = []
      }
      try {
        result.interests = result.interests ? JSON.parse(result.interests) : []
      } catch (e) {
        result.interests = []
      }
    }
    
    return result
  },

  getProfile: async (userId) => {
    const user = await database.queryOne('SELECT id, nickname, avatar_url, phone, created_at FROM users WHERE id = ?', [userId])
    const profile = await database.queryOne('SELECT * FROM user_profiles WHERE user_id = ?', [userId])
    
    // 解析 JSON 字段
    let parsedProfile = profile || {}
    if (parsedProfile.skills) {
      try {
        parsedProfile.skills = JSON.parse(parsedProfile.skills)
      } catch (e) {
        parsedProfile.skills = []
      }
    }
    if (parsedProfile.interests) {
      try {
        parsedProfile.interests = JSON.parse(parsedProfile.interests)
      } catch (e) {
        parsedProfile.interests = []
      }
    }
    
    return { ...user, ...parsedProfile }
  }
}

module.exports = User
