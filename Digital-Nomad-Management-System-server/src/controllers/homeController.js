const database = require('../db/database')
const bannerController = require('./bannerController')

const getHome = async (req, res, next) => {
  try {
    const [packages, events, guides] = await Promise.all([
      database.query('SELECT id, title, cover_url, price_min, price_max, tags FROM packages WHERE status = "published" ORDER BY created_at DESC LIMIT 4'),
      database.query('SELECT id, title, cover_url, start_time, venue_name, fee_type, capacity FROM events WHERE status = "published" ORDER BY start_time ASC LIMIT 4'),
      database.query('SELECT id, type, name, description FROM pois WHERE status = "published" LIMIT 6')
    ])

    // 处理 packages 数据：解析 tags 字段
    const processedPackages = packages.map(pkg => {
      let tags = []
      try {
        tags = typeof pkg.tags === 'string' ? JSON.parse(pkg.tags) : pkg.tags
      } catch (e) {
        tags = []
      }
      return {
        id: pkg.id,
        title: pkg.title,
        coverUrl: pkg.cover_url,
        priceMin: pkg.price_min,
        priceMax: pkg.price_max,
        tags: tags
      }
    })

    // 处理 events 数据：格式化时间
    const processedEvents = events.map(event => {
      const startTime = new Date(event.start_time)
      const formattedTime = `${startTime.getMonth() + 1}/${startTime.getDate()} ${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`
      return {
        id: event.id,
        title: event.title,
        coverUrl: event.cover_url,
        startTime: formattedTime,
        venueName: event.venue_name || '待定',
        feeType: event.fee_type,
        capacity: event.capacity
      }
    })

    // 处理 guides 数据
    const processedGuides = guides.map(guide => ({
      id: guide.id,
      type: guide.type,
      name: guide.name,
      description: guide.description
    }))

    res.json({
      code: 0,
      message: 'success',
      data: {
        featuredPackages: processedPackages,
        upcomingEvents: processedEvents,
        quickGuides: processedGuides
      }
    })
  } catch (error) {
    next(error)
  }
}

const getRecommendations = async (req, res, next) => {
  try {
    const packages = await database.query('SELECT id, title FROM packages WHERE status = "published" LIMIT 3')
    const events = await database.query('SELECT id, title FROM events WHERE status = "published" LIMIT 3')
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        featuredPackages: packages.map(p => ({ ...p, reason: '热门推荐' })),
        upcomingEvents: events.map(e => ({ ...e, reason: '近期活动' }))
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getHome,
  getRecommendations,
  getBanners: bannerController.getBanners
}
