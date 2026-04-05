const database = require('../../db/database')

const getList = async (req, res, next) => {
  try {
    let sql = `SELECT pl.*, p.title as package_title, u.nickname as user_nickname 
               FROM package_leads pl 
               LEFT JOIN packages p ON pl.package_id = p.id 
               LEFT JOIN users u ON pl.user_id = u.id 
               WHERE 1=1`
    const values = []

    if (req.query.status) {
      sql += ' AND pl.status = ?'
      values.push(req.query.status)
    }

    sql += ' ORDER BY pl.created_at DESC'

    const data = await database.paginate(sql, values, req.query.page || 1, req.query.pageSize || 10)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await db.queryOne(`
      SELECT pl.*, p.title as package_title, u.nickname as user_nickname
      FROM package_leads pl
      LEFT JOIN packages p ON pl.package_id = p.id
      LEFT JOIN users u ON pl.user_id = u.id
      WHERE pl.id = ?
    `, [req.params.id])
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const updateStatus = async (req, res, next) => {
  try {
    await db.update('package_leads', { 
      status: req.body.status, 
      note: req.body.note,
      updated_at: new Date() 
    }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  getDetail,
  updateStatus
}
