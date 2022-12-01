const router = require('express').Router()

const { 
    addFriend,
    removeFriend, 
    cancelRequest,
    confirmFriendRequest, 
    rejectFriendRequest 
} = require('../controllers/friend-requests-controller') 

const { ensureAuthenticated } = require('../auth/ensureAuthenticated')

router.post('/add-friend', ensureAuthenticated, addFriend)
router.post('/remove-friend', removeFriend)
router.post('/cancel-request', cancelRequest)
router.post('/confirm-request', confirmFriendRequest)
router.post('/reject-request', rejectFriendRequest)

module.exports = router