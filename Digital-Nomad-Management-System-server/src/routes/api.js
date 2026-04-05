const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const packageController = require('../controllers/packageController')
const eventController = require('../controllers/eventController')
const guideController = require('../controllers/guideController')
const postController = require('../controllers/postController')
const communityController = require('../controllers/communityController')
const { authenticate } = require('../middleware/auth')

router.post('/auth/wx-login', authController.wxLogin)
router.get('/me', authenticate, authController.getMe)
router.put('/me/profile', authenticate, authController.updateProfile)

router.get('/home', homeController.getHome)
router.get('/home/banners', homeController.getBanners)

router.get('/packages', packageController.getList)
router.get('/packages/:id', packageController.getDetail)
router.post('/package-leads', authenticate, packageController.submitLead)
router.get('/me/package-leads', authenticate, packageController.getMyLeads)

router.get('/events', eventController.getList)
router.get('/events/:id', eventController.getDetail)
router.post('/events/:id/signup', authenticate, eventController.signup)
router.post('/events/:id/cancel', authenticate, eventController.cancel)
router.get('/me/event-signups', authenticate, eventController.getMySignups)

router.get('/guides', guideController.getGuides)
router.get('/pois', guideController.getPois)
router.get('/pois/:id', guideController.getPoiDetail)

router.get('/posts', postController.getList)
router.get('/posts/:id', postController.getDetail)
router.post('/posts', authenticate, postController.create)
router.post('/posts/:id/match', authenticate, postController.match)
router.get('/me/posts', authenticate, postController.getMyPosts)
router.get('/me/matches', authenticate, postController.getMyMatches)

router.get('/community-groups', communityController.getGroups)
router.get('/tasks', communityController.getTasks)
router.get('/tasks/:id', communityController.getTaskDetail)
router.post('/tasks/:id/signup', authenticate, communityController.signupTask)
router.get('/me/task-signups', authenticate, communityController.getMyTaskSignups)

router.get('/recommendations/home', homeController.getRecommendations)
router.post('/match/suggest', postController.suggestMatch)
router.post('/ai/guide-chat', guideController.aiChat)

router.post('/event-logs', (req, res) => {
  res.json({ code: 0, message: 'success' })
})

module.exports = router
