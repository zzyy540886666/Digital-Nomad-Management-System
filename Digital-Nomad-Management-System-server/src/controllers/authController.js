const jwt = require('jsonwebtoken')
const axios = require('axios')
const User = require('../models/User')

const wxLogin = async (req, res, next) => {
  try {
    const { jsCode } = req.body
    
    const wxRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WX_APPID,
        secret: process.env.WX_SECRET,
        js_code: jsCode,
        grant_type: 'authorization_code'
      }
    })

    const { openid, session_key } = wxRes.data
    if (!openid) {
      return res.status(400).json({ code: 400, message: '微信登录失败' })
    }

    let user = await User.findByOpenid(openid)
    if (!user) {
      user = await User.create({ openid })
    }

    const token = jwt.sign(
      { userId: user.id, openid },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      code: 0,
      message: 'success',
      data: { token, user: { id: user.id, nickname: user.nickname, avatarUrl: user.avatar_url } }
    })
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    const profile = await User.getProfile(req.userId)
    res.json({ code: 0, message: 'success', data: profile })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const profile = await User.updateProfile(req.userId, req.body)
    res.json({ code: 0, message: 'success', data: profile })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  wxLogin,
  getMe,
  updateProfile
}
