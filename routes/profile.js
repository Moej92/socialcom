const router = require('express').Router()
const { getUserProfile } = require('../controllers/profile-controller')
const { ensureAuthenticated } = require('../auth/ensureAuthenticated')

router.get('/', ensureAuthenticated, getUserProfile)
router.get('/:username', ensureAuthenticated, getUserProfile)

module.exports = router