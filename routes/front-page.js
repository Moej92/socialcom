const router = require('express').Router()
const frontPageController = require('../controllers/render-front-page')

router.get('/', frontPageController.getFrontPage)

module.exports = router