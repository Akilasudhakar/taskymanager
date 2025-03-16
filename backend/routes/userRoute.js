const express = require('express')
const router = express.Router()
const { registerUser, getUser, signIn, deleteUser, pendingTask, completedTask } = require('../controllers/userController')
const {protect} = require('../middleWare/authMiddleware')

router.get('/profile', protect, getUser)
router.post('/signup', registerUser)
router.post('/signin', signIn)
router.delete('/removeuser', protect, deleteUser)
router.route('/pending').get(protect, pendingTask);
router.get('/completed', protect, completedTask);


module.exports = router