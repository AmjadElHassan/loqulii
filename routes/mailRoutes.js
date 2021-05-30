let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
let bcrypt = require("bcrypt")
const session = require('express-session')


router.get('/', async (req, res, next) => {//we configured the router to handle requests at root "/" 

    let payLoad = {
        pageTitle: "Inbox",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(userLoggedIn)
    }

    res.status(200).render("mailPage", payLoad)

})

router.get('/new', async (req, res, next) => {//we configured the router to handle requests at root "/" 

    let payLoad = {
        pageTitle: "New Message",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(userLoggedIn)
    }

    res.status(200).render("newMessage", payLoad)

})

module.exports = router