let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
let bcrypt = require("bcrypt")
const session = require('express-session')


router.get('/', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    let payLoad = await createPayload(req.session.user)
    payLoad.selectedTab = "posts"
    res.status(200).render("searchPage", payLoad)

})

router.get('/:selectedTab', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    let payLoad = await createPayload(req.session.user)
    payLoad.selectedTab = req.params.selectedTab
    res.status(200).render("searchPage", payLoad)

})

function createPayload(userLoggedIn){
    return {
        pageTitle: "Search",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
    }
}

module.exports = router