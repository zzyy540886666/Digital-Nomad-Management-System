const database = require('../db/database')

const getGuides = async (req, res, next) => {
  try {
    const data = await database.query('SELECT * FROM pois WHERE status = "published" GROUP BY type')
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getPois = async (req, res, next) => {
  try {
    let sql = 'SELECT * FROM pois WHERE status = "published"'
    const values = []

    if (req.query.type) {
      sql += ' AND type = ?'
      values.push(req.query.type)
    }

    if (req.query.keyword) {
      sql += ' AND (name LIKE ? OR address LIKE ?)'
      values.push(`%${req.query.keyword}%`, `%${req.query.keyword}%`)
    }

    const data = await database.query(sql, values)
    res.json({ code: 0, message: 'success', data: { list: data, total: data.length } })
  } catch (error) {
    next(error)
  }
}

const getPoiDetail = async (req, res, next) => {
  try {
    const data = await database.queryOne('SELECT * FROM pois WHERE id = ?', [req.params.id])
    if (!data) {
      return res.status(404).json({ code: 404, message: '点位不存在' })
    }
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const aiChat = async (req, res, next) => {
  try {
    const { query } = req.body
    res.json({
      code: 0,
      message: 'success',
      data: {
        answer: `关于"${query}"的问题，建议您查看生活指引页面获取详细信息。`,
        citations: []
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getGuides,
  getPois,
  getPoiDetail,
  aiChat
}
