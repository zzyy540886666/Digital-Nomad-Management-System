const database = require('../db/database')

// 获取轮播图列表
const getBanners = async (req, res, next) => {
  try {
    const results = await database.query(
      `SELECT id, title, image_url, url, sort_order 
       FROM banners 
       WHERE status = 'published' 
       ORDER BY sort_order ASC, created_at DESC 
       LIMIT 10`
    )
    
    const banners = results.map(item => ({
      id: item.id,
      title: item.title,
      imageUrl: item.image_url,
      url: item.url,
      sortOrder: item.sort_order
    }))
    
    res.json({
      code: 0,
      message: 'success',
      data: banners
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getBanners
}
