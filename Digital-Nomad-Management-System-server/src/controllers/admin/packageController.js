const database = require('../../db/database')

const getList = async (req, res, next) => {
  try {
    const data = await database.paginate('SELECT * FROM packages ORDER BY created_at DESC', [], req.query.page || 1, req.query.pageSize || 10)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await database.queryOne('SELECT * FROM packages WHERE id = ?', [req.params.id])
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const result = await db.insert('packages', {
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
    await db.update('packages', { ...req.body, updated_at: new Date() }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    await db.remove('packages', 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  try {
    await db.update('packages', { status: req.body.status, updated_at: new Date() }, 'id = ?', [req.params.id])
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
  remove,
  updateStatus
}
