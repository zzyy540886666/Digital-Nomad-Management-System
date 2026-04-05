const database = require('../db/database')

// 解析 JSON 字段
const parseJsonFields = (pkg) => {
  if (!pkg) return null
  
  const parsed = { ...pkg }
  
  // 解析 tags
  if (parsed.tags && typeof parsed.tags === 'string') {
    try {
      parsed.tags = JSON.parse(parsed.tags)
    } catch (e) {
      parsed.tags = []
    }
  }
  
  // 解析 images
  if (parsed.images && typeof parsed.images === 'string') {
    try {
      parsed.images = JSON.parse(parsed.images)
    } catch (e) {
      parsed.images = []
    }
  }
  
  // 解析 duration_options
  if (parsed.duration_options && typeof parsed.duration_options === 'string') {
    try {
      parsed.durationOptions = JSON.parse(parsed.duration_options)
    } catch (e) {
      parsed.durationOptions = []
    }
  }
  
  // 转换字段名为驼峰命名
  parsed.coverUrl = parsed.cover_url
  parsed.priceMin = parsed.price_min
  parsed.priceMax = parsed.price_max
  parsed.priceNote = parsed.price_note
  parsed.createdAt = parsed.created_at
  parsed.updatedAt = parsed.updated_at
  
  return parsed
}

const Package = {
  getList: async (params = {}) => {
    let sql = 'SELECT * FROM packages WHERE status = "published"'
    const conditions = []
    const values = []

    if (params.budgetLevel) {
      conditions.push('JSON_CONTAINS(tags, ?)')
      values.push(JSON.stringify(params.budgetLevel))
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ')
    }

    sql += ' ORDER BY created_at DESC'

    let result
    if (params.page && params.pageSize) {
      result = await database.paginate(sql, values, params.page, params.pageSize)
      result.list = result.list.map(parseJsonFields)
      return result
    }

    result = await database.query(sql, values)
    return result.map(parseJsonFields)
  },

  getDetail: async (id) => {
    const pkg = await database.queryOne('SELECT * FROM packages WHERE id = ?', [id])
    if (!pkg) return null

    const items = await database.query('SELECT * FROM package_items WHERE package_id = ?', [id])
    const parsed = parseJsonFields(pkg)
    parsed.items = items
    
    return parsed
  },

  createLead: async (data) => {
    const result = await database.insert('package_leads', {
      ...data,
      status: 'submitted',
      created_at: new Date(),
      updated_at: new Date()
    })
    return { id: result.insertId, ...data }
  },

  getMyLeads: async (userId) => {
    return database.query(`
      SELECT pl.*, p.title as package_title, p.cover_url as package_cover_url
      FROM package_leads pl
      LEFT JOIN packages p ON pl.package_id = p.id
      WHERE pl.user_id = ?
      ORDER BY pl.created_at DESC
    `, [userId])
  }
}

module.exports = Package
