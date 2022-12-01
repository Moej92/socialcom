const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

const { User } = require('../models/user')

module.exports = function(passport) {

    passport.use(new LocalStrategy(
        { passReqToCallback: true },
        function (req, username, password, done) {
            User.findOne({ username: username }, (err, doc) => {
                if (err) return done(err)
                if (!doc) return done(null, false, req.flash('loginError', 'Invalid username'))
                if (!bcrypt.compareSync(password, doc.password)) return done(null, false, req.flash('loginError', ['Incorrect password', username]))
                return done(null, doc)
            })
        }
    ))

    passport.serializeUser((userDoc, done) => {
        // console.log("serialize: ", userDoc)
        return done(null, userDoc.id)
    })

    passport.deserializeUser((userID, done) => {
        User.findById(userID, (err, doc) => {
            // console.log("deserialize: ", doc)
            done(err, doc)
        })
    })

}