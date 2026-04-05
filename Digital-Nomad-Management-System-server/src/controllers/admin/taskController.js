const database = require('../../db/database')

const getList = async (req, res, next) => {
  try {
    const data = await database.paginate('SELECT * FROM tasks ORDER BY created_at DESC', [], req.query.page || 1, req.query.pageSize || 10)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await database.queryOne('SELECT * FROM tasks WHERE id = ?', [req.params.id])
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const result = await db.insert('tasks', {
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
    await db.update('tasks', { ...req.body, updated_at: new Date() }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await db.remove('tasks', 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
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
