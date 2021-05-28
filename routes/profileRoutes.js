let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
let bcrypt = require("bcrypt")
const session = require('express-session')


router.get('/:username', async (req, res, next) => {//we configured the router to handle requests at root "/" 

    if (!req.session.user) {
        return res.status(200).redirect("/")
    }
    let payLoad = await getPayload(req.params.username,req.session.user)

    res.status(200).render("profilePage", payLoad)

})
router.get('/:username/replies', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    if (!req.session.user) {
        return res.status(200).redirect("/")
    }
    let payLoad = await getPayload(req.params.username,req.session.user)
    payLoad.selectedTab = "replies"

    res.status(200).render("profilePage", payLoad)

})
router.get('/:username/following', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    if (!req.session.user) {
        return res.status(200).redirect("/")
    }
    let payLoad = await getPayload(req.params.username,req.session.user)
    payLoad.selectedTab = "following"

    res.status(200).render("followPage", payLoad)

})
router.get('/:username/followers', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    if (!req.session.user) {
        return res.status(200).redirect("/")
    }
    let payLoad = await getPayload(req.params.username,req.session.user)
    payLoad.selectedTab = "followers"

    res.status(200).render("followPage", payLoad)

})

async function getPayload(username,userLoggedIn) {
    try {
        let user = await User.findOne({ username: username })
        if (!user) {

            user = await User.findById(username)

            if (!user){
                return {
                    pageTitle: "User Not Found",
                    userLoggedIn: userLoggedIn,
                    userLoggedInJs: JSON.stringify(userLoggedIn)            
                }    
            }
        }
        return {
            pageTitle: user.username,
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: user
        }

    }
    catch (err) {
        console.log(err)
    }

}

module.exports = router