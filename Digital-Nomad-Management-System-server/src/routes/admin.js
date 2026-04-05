const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/admin/authController')
const dashboardController = require('../controllers/admin/dashboardController')
const packageController = require('../controllers/admin/packageController')
const eventController = require('../controllers/admin/eventController')
const poiController = require('../controllers/admin/poiController')
const postController = require('../controllers/admin/postController')
const leadController = require('../controllers/admin/leadController')
const taskController = require('../controllers/admin/taskController')
const groupController = require('../controllers/admin/groupController')
const bannerController = require('../controllers/admin/bannerController')
const { authenticateAdmin } = require('../middleware/auth')

router.post('/auth/login', adminAuthController.login)
router.post('/auth/logout', authenticateAdmin, adminAuthController.logout)
router.get('/auth/profile', authenticateAdmin, adminAuthController.getProfile)

router.get('/analytics/overview', authenticateAdmin, dashboardController.getOverview)
router.get('/analytics/funnel', authenticateAdmin, dashboardController.getFunnel)

router.get('/packages', authenticateAdmin, packageController.getList)
router.get('/packages/:id', authenticateAdmin, packageController.getDetail)
router.post('/packages', authenticateAdmin, packageController.create)
router.put('/packages/:id', authenticateAdmin, packageController.update)
router.delete('/packages/:id', authenticateAdmin, packageController.remove)
router.put('/packages/:id/status', authenticateAdmin, packageController.updateStatus)

router.get('/events', authenticateAdmin, eventController.getList)
router.get('/events/:id', authenticateAdmin, eventController.getDetail)
router.post('/events', authenticateAdmin, eventController.create)
router.put('/events/:id', authenticateAdmin, eventController.update)
router.delete('/events/:id', authenticateAdmin, eventController.remove)
router.get('/events/:id/signups', authenticateAdmin, eventController.getSignups)

router.get('/pois', authenticateAdmin, poiController.getList)
router.get('/pois/:id', authenticateAdmin, poiController.getDetail)
router.post('/pois', authenticateAdmin, poiController.create)
router.put('/pois/:id', authenticateAdmin, poiController.update)
router.delete('/pois/:id', authenticateAdmin, poiController.remove)

router.get('/posts', authenticateAdmin, postController.getList)
router.get('/posts/:id', authenticateAdmin, postController.getDetail)
router.put('/posts/:id/approve', authenticateAdmin, postController.approve)
router.put('/posts/:id/reject', authenticateAdmin, postController.reject)
router.delete('/posts/:id', authenticateAdmin, postController.remove)

router.get('/leads', authenticateAdmin, leadController.getList)
router.get('/leads/:id', authenticateAdmin, leadController.getDetail)
router.put('/leads/:id/status', authenticateAdmin, leadController.updateStatus)

router.get('/tasks', authenticateAdmin, taskController.getList)
router.get('/tasks/:id', authenticateAdmin, taskController.getDetail)
router.post('/tasks', authenticateAdmin, taskController.create)
router.put('/tasks/:id', authenticateAdmin, taskController.update)
router.delete('/tasks/:id', authenticateAdmin, taskController.remove)

router.get('/community-groups', authenticateAdmin, groupController.getList)
router.put('/community-groups/:id', authenticateAdmin, groupController.update)
router.put('/community-groups/:id/qrcode', authenticateAdmin, groupController.updateQrCode)

// 轮播图管理
router.get('/banners', authenticateAdmin, bannerController.getList)
router.get('/banners/:id', authenticateAdmin, bannerController.getDetail)
router.post('/banners', authenticateAdmin, bannerController.create)
router.put('/banners/:id', authenticateAdmin, bannerController.update)
router.delete('/banners/:id', authenticateAdmin, bannerController.remove)

module.exports = router
