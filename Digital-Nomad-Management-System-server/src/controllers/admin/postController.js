const database = require('../../db/database')

const getList = async (req, res, next) => {
  try {
    let sql = 'SELECT p.*, u.nickname as user_nickname FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE 1=1'
    const values = []

    if (req.query.status) {
      sql += ' AND p.status = ?'
      values.push(req.query.status)
    }

    sql += ' ORDER BY p.created_at DESC'

    const data = await database.paginate(sql, values, req.query.page || 1, req.query.pageSize || 10)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await db.queryOne('SELECT p.*, u.nickname as user_nickname FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?', [req.params.id])
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const approve = async (req, res, next) => {
  try {
    await db.update('posts', { status: 'approved', updated_at: new Date() }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const reject = async (req, res, next) => {
  try {
    await db.update('posts', { status: 'rejected', updated_at: new Date() }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await db.remove('posts', 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  getDetail,
  approve,
  reject,
  remove
}
