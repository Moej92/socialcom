const mongoose = require('mongoose')

const connection = async (cb) => {
    const URI = process.env.MONGO_URI

    const options = {
        dbname: "Socialcom"
    }

    try {
        await mongoose.connect(URI, options)
        console.log(mongoose.connection.readyState)
        await cb()
    } catch(err) {
        throw new Error('Unable to Connect to Database')
    }
    
}

module.exports = connection
