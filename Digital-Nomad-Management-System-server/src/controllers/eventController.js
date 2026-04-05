const Event = require('../models/Event')

const getList = async (req, res, next) => {
  try {
    const data = await Event.getList(req.query)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await Event.getDetail(req.params.id)
    if (!data) {
      return res.status(404).json({ code: 404, message: '活动不存在' })
    }
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const signup = async (req, res, next) => {
  try {
    const data = await Event.signup(req.params.id, req.userId)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const cancel = async (req, res, next) => {
  try {
    await Event.cancel(req.params.id, req.userId)
    res.json({ code: 0, message: 'success' })
  } catch (error) {
    next(error)
  }
}

const getMySignups = async (req, res, next) => {
  try {
    const data = await Event.getMySignups(req.userId)
    res.json({ code: 0, message: 'success', data: { list: data, total: data.length } })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  getDetail,
  signup,
  cancel,
  getMySignups
}
