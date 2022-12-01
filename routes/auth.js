const router = require('express').Router()
const { rendeRegistrationPage, newUserRegister, passportAuth, userLogout } = require('../controllers/auth-controller')

router.get('/register', rendeRegistrationPage)
router.post('/register', newUserRegister, passportAuth)
router.post('/login', passportAuth)
router.get('/logout', userLogout)

module.exports = router