const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '未登录' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户不存在' })
    }

    req.user = user
    req.userId = user.id
    next()
  } catch (error) {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
}

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '未登录' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ code: 403, message: '无权限' })
    }

    req.admin = decoded
    req.adminId = decoded.adminId
    next()
  } catch (error) {
    return res.status(401).json({ code: 401, message: '登录已过期' })
  }
}

module.exports = {
  authenticate,
  authenticateAdmin
}
