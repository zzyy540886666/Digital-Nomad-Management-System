const Package = require('../models/Package')

const getList = async (req, res, next) => {
  try {
    const data = await Package.getList(req.query)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await Package.getDetail(req.params.id)
    if (!data) {
      return res.status(404).json({ code: 404, message: '产品包不存在' })
    }
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const submitLead = async (req, res, next) => {
  try {
    const data = await Package.createLead({
      ...req.body,
      user_id: req.userId
    })
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getMyLeads = async (req, res, next) => {
  try {
    const data = await Package.getMyLeads(req.userId)
    res.json({ code: 0, message: 'success', data: { list: data, total: data.length } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  getDetail,
  submitLead,
  getMyLeads
}
