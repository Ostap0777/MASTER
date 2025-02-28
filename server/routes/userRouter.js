const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleWare/authMiddleWare')


router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.get('/auth',authMiddleware ,userController.check)




module.exports = router