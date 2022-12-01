const getSettingsTab = async (req, res) => {
    const { username, avatar, social_media } = req.user

    const nameErr = req.flash('name_err')[0]
    const passwordErr = req.flash('password_err')[0]
    const fileErr = req.flash('file_err')[0]

    let tab;

    if (req.url == '/') return res.redirect('/settings/account-settings')
    else if (req.url === '/account-settings') tab = 'account-settings'
    else if (req.url === '/profile-settings') tab = 'profile-settings'

    return res.render(
        process.cwd() + '/views/pug/settings.pug', 
        { username, avatar, social_media, tab, nameErr, passwordErr, fileErr }
    )
}

const bcrypt = require('bcrypt')
const { User } = require('../models/user.js')

const changeUsername = async (req, res) => {
    const { user: userID } = req.session.passport
    const { username } = req.body
    const doc = await User.findOne({ username }).exec()
    if (doc) {
        req.flash('name_err', username + ' has already been taken')
        return res.redirect('/settings/account-settings')
    }

    const userDoc = await User.findById(userID).exec()
    userDoc.username = username
    const updatedDoc = await userDoc.save()
    res.redirect('/settings/account-settings')
}

const changePassword = async (req, res) => {
    const { id } = req.user
    const { currentPassword, newPassword } = req.body

    const userDoc = await User.findById(id).exec()
    const userPassword = userDoc.password
    
    bcrypt.compare(currentPassword, userPassword, (err, response) => {
        if (err) return console.error('change password err', err)
        if (!response) {
            req.flash('password_err', 'Incorrect password')
            return res.redirect('/settings/account-settings')
        } else {
            bcrypt.hash(newPassword, 12, async (err, hash) => {
                if (err) return console.error('change password err', err)
                userDoc.password = hash
                const updatedDoc = await userDoc.save()
                return res.redirect('/settings/account-settings')
            })
        }
    })

}

const fs = require('fs')
const changeAvatar = async (req, res) => {
    const { username } = req.user
    const { file } = req

    if (!file) {
        req.flash('file_err', 'Uploaded file must be an Image File')
        return res.redirect('/settings/profile-settings')
    }
    const userDoc = await User.findOne({ username }).exec()
    const userAvatar = userDoc.avatar.slice(1)

    userDoc.avatar = '/uploaded-avatars/' + file.originalname
    const updatedDoc = await userDoc.save()

    if (userAvatar.split('/')[0] === 'uploaded-avatars') {
        fs.unlink(process.cwd() + '/avatars/' + userAvatar, (err) => {
            if (err) console.error('avatar error: ', err)
            else console.log('successfuly deleted') 
        })
    }
    return res.redirect('/settings/profile-settings')
}

const addSocialMedia = async (req, res) => {
    const { username } = req.user

    const userDoc = await User.findOne({ username }).exec()
    userDoc.social_media = req.body
    const updatedDoc = await userDoc.save()
    return res.redirect('/settings/profile-settings')
}

module.exports = { getSettingsTab, changeUsername, changePassword, changeAvatar, addSocialMedia }