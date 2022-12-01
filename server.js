require('dotenv').config()
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo');

const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

const app = express()

require('./auth/localStrategy')(passport)


app.use(express.static(path.join(process.cwd(), '/public')))
app.use(express.static(path.join(process.cwd(), '/avatars')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug')

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    maxAge: 1000 * 30,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: 'Socialcom',
        collectionName: 'sessions',
        autoRemove: 'interval',
        autoRemoveInterval: 2
    })
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

const connection = require('./connection.js');
connection(() => {
    app.use('/', require('./routes/front-page'))
    app.use('/', require('./routes/auth'))
    app.use('/profile', require('./routes/profile'))
    app.use('/request', require('./routes/friend-requests'))
    // app.use('/request', require('./routes/friend-requests'))
    app.use('/settings', require('./routes/settings'))
    
}).catch(err => {
    console.error(err)
    app.use((req, res) => {
        res.status(500)
        res.send('Internal Server Error 500')
    })
})


app.listen(5500, () => console.log('Server is listening to 5500'))