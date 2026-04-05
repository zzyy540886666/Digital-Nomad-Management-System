const database = require('../../db/database')

const getList = async (req, res, next) => {
  try {
    const data = await database.paginate('SELECT * FROM events ORDER BY created_at DESC', [], req.query.page || 1, req.query.pageSize || 10)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await database.queryOne('SELECT * FROM events WHERE id = ?', [req.params.id])
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const result = await database.insert('events', {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    })
    res.json({ code: 0, message: 'success', data: { id: result.insertId } })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    await db.update('events', { ...req.body, updated_at: new Date() }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await db.remove('events', 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const getSignups = async (req, res, next) => {
  try {
    const data = await db.query(`
      SELECT es.*, u.nickname, u.avatar_url, u.phone
      FROM event_signups es
      LEFT JOIN users u ON es.user_id = u.id
      WHERE es.event_id = ?
    `, [req.params.id])
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  getDetail,
  create,
  update,
  remove,
  getSignups
}
