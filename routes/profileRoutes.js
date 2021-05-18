let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
let bcrypt = require("bcrypt")
const session = require('express-session')


router.get('/:id', (req, res, next) => {//we configured the router to handle requests at root "/" 
    console.log(req.params)

    if (!req.session.user){
        return res.status(200).redirect("/")
    }
    var payLoad = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
        }

    console.log(payLoad.postId)

    res.status(200).render("profilePage",payLoad)

})


module.exports = router