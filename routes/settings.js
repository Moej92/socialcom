const router = require('express').Router()
const { ensureAuthenticated } = require('../auth/ensureAuthenticated')
const { 
    getSettingsTab, 
    changeUsername,
    changePassword,
    changeAvatar,
    addSocialMedia } = require('../controllers/settings-controller')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './avatars/uploaded-avatars')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
        storage: storage,
        fileFilter: function(req, file, cb) {
            if (file.mimetype.slice(0, 5) !== 'image') return cb(null, false)
            else return cb(null, true)    
        } 
    })

router.get('/', ensureAuthenticated, getSettingsTab)

router.get('/account-settings', ensureAuthenticated, getSettingsTab)
router.post('/account-settings/change-username', changeUsername)
router.post('/account-settings/change-password', changePassword)

router.get('/profile-settings', ensureAuthenticated, getSettingsTab)
router.post('/profile-settings/change-avatar', upload.single('upload_avatar'), changeAvatar)
router.post('/profile-settings/add-socialmedia', addSocialMedia)

module.exports = router
