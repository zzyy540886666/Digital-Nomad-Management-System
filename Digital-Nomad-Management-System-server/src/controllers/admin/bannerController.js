const database = require('../../db/database')

// 获取轮播图列表
const getList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query
    const offset = (page - 1) * pageSize
    
    let sql = 'SELECT * FROM banners WHERE 1=1'
    let countSql = 'SELECT COUNT(*) as total FROM banners WHERE 1=1'
    const params = []
    const countParams = []
    
    if (status) {
      sql += ' AND status = ?'
      countSql += ' AND status = ?'
      params.push(status)
      countParams.push(status)
    }
    
    sql += ' ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(pageSize), offset)
    
    const banners = await database.query(sql, params)
    const totalResult = await database.query(countSql, countParams)
    const total = totalResult[0]?.total || 0
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        list: banners.map(item => ({
          id: item.id,
          title: item.title,
          imageUrl: item.image_url,
          url: item.url,
          sortOrder: item.sort_order,
          status: item.status,
          createdAt: item.created_at
        })),
        total: total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    })
  } catch (error) {
    next(error)
  }
}

// 获取轮播图详情
const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params
    const banner = await database.queryOne('SELECT * FROM banners WHERE id = ?', [id])
    
    if (!banner) {
      return res.status(404).json({ code: 404, message: '轮播图不存在' })
    }
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        id: banner.id,
        title: banner.title,
        imageUrl: banner.image_url,
        url: banner.url,
        sortOrder: banner.sort_order,
        status: banner.status
      }
    })
  } catch (error) {
    next(error)
  }
}

// 创建轮播图
const create = async (req, res, next) => {
  try {
    const { title, imageUrl, url, sortOrder = 0, status = 'published' } = req.body
    
    const result = await database.insert('banners', {
      title,
      image_url: imageUrl,
      url,
      sort_order: sortOrder,
      status
    })
    
    res.json({
      code: 0,
      message: 'success',
      data: { id: result.insertId }
    })
  } catch (error) {
    next(error)
  }
}

// 更新轮播图
const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, imageUrl, url, sortOrder, status } = req.body
    
    await database.update('banners', {
      title,
      image_url: imageUrl,
      url,
      sort_order: sortOrder,
      status
    }, 'id = ?', [id])
    
    res.json({
      code: 0,
      message: 'success'
    })
  } catch (error) {
    next(error)
  }
}

// 删除轮播图
const remove = async (req, res, next) => {
  try {
    const { id } = req.params
    await database.remove('banners', 'id = ?', [id])
    
    res.json({
      code: 0,
      message: 'success'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  getDetail,
  create,
  update,
  remove
}
