const { User } = require('../models/user.js')

const user = async(username) => {
    const userDoc = await User.findOne({ username: username }).exec()
    return userDoc
}

const userFriends = async (username) => {
    const friendsDocs = await User.find({ friends: username }).limit(10).lean().exec()
    return friendsDocs.map(doc => ({ username: doc.username, avatar: doc.avatar }))
}

const profileData = (userDoc, profileStatus) => {
    const { username, avatar } = userDoc
    return { username, avatar, profileStatus }
}

const getUserProfile = async (req, res) => {
    const { username: main_username, avatar: main_avatar, friends, friend_requests } = req.user

    if (!req.params.username) {
        const userDoc = await user(main_username)
        const profileFriends = await userFriends(main_username)
        // console.log(profileFriends)
        return res.render(
            process.cwd() + '/views/pug/profile.pug', 
            { main_username, main_avatar, profileData: profileData(userDoc, 'user profile'), friends: profileFriends }
        ) 
    } else {
        const profileUsername = req.params.username
        if (profileUsername === main_username) return res.redirect('/profile')

        const userDoc = await user(profileUsername)
        if (!userDoc) return res.render(
            process.cwd() + '/views/pug/profile.pug', 
            { main_username, main_avatar, profileData: null }
        )

        let userData;
        if (userDoc.friend_requests.includes(main_username)) userData = profileData(userDoc, 'friend request profile')
        else if (friend_requests.includes(profileUsername)) userData = profileData(userDoc, 'received friend request profile')
        else if (friends.includes(profileUsername)) userData = profileData(userDoc, 'friend profile')
        else userData = profileData(userDoc, 'non friend profile')

        const profileFriends = await userFriends(profileUsername)
        // console.log(profileFriends)
        return res.render(process.cwd() + '/views/pug/profile.pug', { main_username, main_avatar, profileData: userData, friends: profileFriends })

    }

}

module.exports = { getUserProfile }

