let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
let bcrypt = require("bcrypt")
const session = require('express-session')
const path = require('path')


router.get('/images/:path', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    res.sendFile(path.join(__dirname,`../uploads/images/${req.params.path}`))
})

module.exports = router