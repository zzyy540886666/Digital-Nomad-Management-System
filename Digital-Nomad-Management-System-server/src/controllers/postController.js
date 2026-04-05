const Post = require('../models/Post')

const getList = async (req, res, next) => {
  try {
    const data = await Post.getList(req.query)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const data = await Post.getDetail(req.params.id)
    if (!data) {
      return res.status(404).json({ code: 404, message: '内容不存在' })
    }
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const data = await Post.create({
      ...req.body,
      user_id: req.userId
    })
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const match = async (req, res, next) => {
  try {
    const post = await Post.getDetail(req.params.id)
    if (!post) {
      return res.status(404).json({ code: 404, message: '内容不存在' })
    }

    const data = await Post.match(req.params.id, req.userId, post.user_id, req.body.message)
    res.json({ code: 0, message: 'success', data })
  } catch (error) {
    next(error)
  }
}

const getMyPosts = async (req, res, next) => {
  try {
    const data = await Post.getMyPosts(req.userId)
    res.json({ code: 0, message: 'success', data: { list: data, total: data.length } })
  } catch (error) {
    next(error)
  }
}

const getMyMatches = async (req, res, next) => {
  try {
    const data = await Post.getMyMatches(req.userId)
    res.json({ code: 0, message: 'success', data: { list: data, total: data.length } })
  } catch (error) {
    next(error)
  }
}

const suggestMatch = async (req, res, next) => {
  try {
    res.json({
      code: 0,
      message: 'success',
      data: { candidates: [] }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getList,
  getDetail,
  create,
  match,
  getMyPosts,
  getMyMatches,
  suggestMatch
}
