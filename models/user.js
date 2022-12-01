const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    created_on: { type: Date, default: Date.now() },
    avatar: { type: String, default: '/default-avatar.jpg'},
    social_media: { type: Object, default: { fb: '', insta: '', twitter: ''} },
    friends: { type: [String], default: [] },
    notifications: { type: [Object], default: [] },
    friend_requests: { type: [String], default: [] },
    messages: { type: [Object], defaule: []} 
})

const User = mongoose.model('User', userSchema)

module.exports = { User }