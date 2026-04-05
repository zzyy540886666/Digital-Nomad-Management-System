const database = require('../../db/database')

const getList = async (req, res, next) => {
  try {
    const data = await database.query('SELECT * FROM community_groups ORDER BY created_at DESC')
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    await database.update('community_groups', { ...req.body, updated_at: new Date() }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const updateQrCode = async (req, res, next) => {
  try {
    await db.update('community_groups', { qr_code_url: req.body.qrCodeUrl, updated_at: new Date() }, 'id = ?', [req.params.id])
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  update,
  updateQrCode
}
