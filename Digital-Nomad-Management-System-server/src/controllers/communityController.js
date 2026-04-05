const database = require('../db/database')

const getGroups = async (req, res, next) => {
  try {
    const data = await database.query('SELECT * FROM community_groups WHERE status = "published"')
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getTasks = async (req, res, next) => {
  try {
    let sql = 'SELECT * FROM tasks WHERE status = "published"'
    const values = []

    if (req.query.category) {
      sql += ' AND category = ?'
      values.push(req.query.category)
    }

    sql += ' ORDER BY created_at DESC'

    if (req.query.page && req.query.pageSize) {
      const data = await database.paginate(sql, values, req.query.page, req.query.pageSize)
      res.json({ code: 0, message: 'success', data })
    } else {
      const data = await database.query(sql, values)
      res.json({ code: 0, message: 'success', data: { list: data, total: data.length } })
    }
  } catch (error) {
    next(error)
  }
}

const getTaskDetail = async (req, res, next) => {
  try {
    const data = await database.queryOne('SELECT * FROM tasks WHERE id = ?', [req.params.id])
    if (!data) {
      return res.status(404).json({ code: 404, message: '任务不存在' })
    }
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const signupTask = async (req, res, next) => {
  try {
    const existing = await database.queryOne(
      'SELECT * FROM task_signups WHERE task_id = ? AND user_id = ?',
      [req.params.id, req.userId]
    )

    if (existing) {
      return res.status(400).json({ code: 400, message: '已报名该任务' })
    }

    await database.insert('task_signups', {
      task_id: req.params.id,
      user_id: req.userId,
      status: 'applied',
      created_at: new Date(),
      updated_at: new Date()
    })

    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const getMyTaskSignups = async (req, res, next) => {
  try {
    const data = await database.query(`
      SELECT ts.*, t.title as task_title, t.category as task_category
      FROM task_signups ts
      LEFT JOIN tasks t ON ts.task_id = t.id
      WHERE ts.user_id = ?
      ORDER BY ts.created_at DESC
    `, [req.userId])
    res.json({ code: 0, message: 'success', data: { list: data, total: data.length } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getGroups,
  getTasks,
  getTaskDetail,
  signupTask,
  getMyTaskSignups
}
