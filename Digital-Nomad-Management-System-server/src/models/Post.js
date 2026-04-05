const database = require('../db/database')

// 解析帖子数据
const parsePostData = (post) => {
  if (!post) return null
  
  // 解析 tags
  let tags = []
  if (post.tags && typeof post.tags === 'string') {
    try {
      tags = JSON.parse(post.tags)
    } catch (e) {
      tags = []
    }
  } else if (post.tags && Array.isArray(post.tags)) {
    tags = post.tags
  }
  
  // 格式化时间
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
  
  return {
    id: post.id,
    userId: post.user_id,
    type: post.type,
    title: post.title,
    content: post.content,
    tags: tags,
    rewardType: post.reward_type,
    availableTime: post.available_time,
    status: post.status,
    createdAt: formatDate(post.created_at),
    createdAtRaw: post.created_at,
    updatedAt: post.updated_at,
    userNickname: post.user_nickname || '匿名用户',
    userAvatar: post.user_avatar || ''
  }
}

const Post = {
  getList: async (params = {}) => {
    let sql = `
      SELECT p.*, u.nickname as user_nickname, u.avatar_url as user_avatar,
        (SELECT COUNT(*) FROM matches m WHERE m.post_id = p.id) as match_count
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.id 
      WHERE p.status = "approved"
    `
    const values = []

    if (params.type) {
      sql += ' AND p.type = ?'
      values.push(params.type)
    }

    sql += ' ORDER BY p.created_at DESC'

    let result
    if (params.page && params.pageSize) {
      result = await database.paginate(sql, values, params.page, params.pageSize)
      result.list = result.list.map(post => {
        const parsed = parsePostData(post)
        parsed.matchCount = post.match_count || 0
        return parsed
      })
      return result
    }

    result = await database.query(sql, values)
    return result.map(post => {
      const parsed = parsePostData(post)
      parsed.matchCount = post.match_count || 0
      return parsed
    })
  },

  getDetail: async (id) => {
    const post = await database.queryOne(`
      SELECT p.*, u.nickname as user_nickname, u.avatar_url as user_avatar
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id])
    
    if (!post) return null

    const parsed = parsePostData(post)
    
    // 获取匹配列表
    const matches = await database.query(`
      SELECT m.*, u.nickname as to_user_nickname, u.avatar_url as to_user_avatar
      FROM matches m
      LEFT JOIN users u ON m.to_user_id = u.id
      WHERE m.post_id = ?
      ORDER BY m.created_at DESC
    `, [id])
    
    parsed.matches = matches.map(m => ({
      id: m.id,
      fromUserId: m.from_user_id,
      toUserId: m.to_user_id,
      toUserNickname: m.to_user_nickname,
      toUserAvatar: m.to_user_avatar,
      message: m.message,
      status: m.status,
      createdAt: m.created_at
    }))
    
    return parsed
  },

  create: async (data) => {
    const tagsJson = Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags
    
    const result = await database.insert('posts', {
      user_id: data.userId,
      type: data.type,
      title: data.title,
      content: data.content,
      tags: tagsJson,
      reward_type: data.rewardType,
      available_time: data.availableTime,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    })
    return { id: result.insertId, ...data }
  },

  match: async (postId, fromUserId, toUserId, message) => {
    const result = await database.insert('matches', {
      from_user_id: fromUserId,
      to_user_id: toUserId,
      post_id: postId,
      message,
      status: 'sent',
      created_at: new Date(),
      updated_at: new Date()
    })
    return { id: result.insertId }
  },

  getMyPosts: async (userId) => {
    const results = await database.query(`
      SELECT p.*, u.nickname as user_nickname, u.avatar_url as user_avatar
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? 
      ORDER BY p.created_at DESC
    `, [userId])
    
    return results.map(parsePostData)
  },

  getMyMatches: async (userId) => {
    const results = await database.query(`
      SELECT m.*, 
        u.nickname as to_user_nickname, u.avatar_url as to_user_avatar,
        p.title as post_title, p.type as post_type
      FROM matches m
      LEFT JOIN users u ON m.to_user_id = u.id
      LEFT JOIN posts p ON m.post_id = p.id
      WHERE m.from_user_id = ? OR m.to_user_id = ?
      ORDER BY m.created_at DESC
    `, [userId, userId])
    
    return results.map(m => ({
      id: m.id,
      postId: m.post_id,
      postTitle: m.post_title,
      postType: m.post_type,
      fromUserId: m.from_user_id,
      toUserId: m.to_user_id,
      toUserNickname: m.to_user_nickname,
      toUserAvatar: m.to_user_avatar,
      message: m.message,
      status: m.status,
      createdAt: m.created_at
    }))
  }
}

module.exports = Post
