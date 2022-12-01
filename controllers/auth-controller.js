const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const passport = require('passport')
const { User } = require('../models/user.js')

const rendeRegistrationPage = (req, res) => {
    res.render(process.cwd() + '/views/pug/register.pug', { errorMsg: req.flash('err_msg') })
}

const newUserRegister = async (req, res, next) => {
    const { username, password } = req.body
    if (!username.trim() || !password.trim()) {
       return res.redirect('/register')
    }

    const userDoc = await User.findOne({ username }).exec()
    if (userDoc) {
        req.flash('err_msg', username + ' has already been taken')
        return res.redirect('/register')
    }
    
    const hashedPassword = bcrypt.hashSync(password, 12)
    const newUser = new User({ username, password: hashedPassword })
    await newUser.save()

    next()
}

const passportAuth = passport.authenticate('local', {failureRedirect: '/', successRedirect: '/profile'});

const userLogout = (req, res) => {
    req.logout((err) => {
        if (err) return console.error(err)
        res.redirect('/')
    })
}

module.exports = { 
    rendeRegistrationPage, 
    newUserRegister, 
    passportAuth, 
    userLogout
}