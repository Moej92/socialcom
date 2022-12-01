const { User } = require('../models/user.js')

// const handleRequest = async (req, res) => {
//     const { main_username, profile_username } = req.body
    
//     const mainDoc = await User.findOne( { username: main_username }).exec()
//     const ProfileDoc = await User.findOne( { username: profile_username }).exec()
// }

const addFriend = async (req, res) => {
    const { main_username, profile_username } = req.body
    await User.findOneAndUpdate(
        { username: profile_username }, 
        { $push: { friend_requests: main_username }}
    )
    return res.redirect('/profile/' + profile_username)
}

const cancelRequest = async (req, res) => {
    const { main_username, profile_username } = req.body
    await User.findOneAndUpdate(
        { username: profile_username },
        { $pull: { friend_requests: main_username }}
    )
    return res.redirect('/profile/' + profile_username)
}

const confirmFriendRequest = async (req, res) => {
    const { main_username, profile_username } = req.body
    await User.findOneAndUpdate(
        { username: main_username }, 
        { $push: { friends: profile_username }, $pull: { friend_requests: profile_username }}
    )
    await User.findOneAndUpdate(
        { username: profile_username }, 
        { $push: { friends: main_username }}
    )
    return res.redirect('/profile/' + profile_username)
}

const rejectFriendRequest = async (req, res) => {
    const { main_username, profile_username } = req.body
    await User.findOneAndUpdate(
        { username: main_username },
        { $pull: {friend_requests: profile_username }}
    )
}

const removeFriend = async (req, res) => {
    const { main_username, profile_username } = req.body
    await User.findOneAndUpdate(
        { username: main_username },
        { $pull: { friends: profile_username }}
    )
    await User.findOneAndUpdate(
        { username: profile_username },
        { $pull: { friends: main_username }}
    )
    return res.redirect('/profile/' + profile_username)
}

module.exports = { addFriend, removeFriend, cancelRequest, confirmFriendRequest, rejectFriendRequest }