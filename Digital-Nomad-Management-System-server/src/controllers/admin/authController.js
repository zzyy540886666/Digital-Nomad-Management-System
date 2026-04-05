const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const database = require('../../db/database')

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const admin = await database.queryOne('SELECT * FROM admins WHERE username = ?', [username])
    if (!admin) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' })
    }

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { adminId: admin.id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      code: 0,
      message: 'success',
      data: {
        token,
        user: { id: admin.id, username: admin.username, nickname: admin.nickname }
      }
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  res.json({ code: 0, message: 'success' })
}

const getProfile = async (req, res, next) => {
  try {
    const admin = await database.queryOne('SELECT id, username, nickname FROM admins WHERE id = ?', [req.adminId])
    res.json({ code: 0, message: 'success', data: admin })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  logout,
  getProfile
}
