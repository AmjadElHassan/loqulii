let mongoose = require('mongoose')
mongoose.set('useFindAndModify',false)
require('dotenv').config()
const url = process.env.ConnectionString

class Database{
    constructor(){
        this.connect()
    }

    connect(){
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        .then(()=>console.log('Database Connection Established'))
        .catch(err=>console.log(err))        
    }
}

module.exports = new Database()