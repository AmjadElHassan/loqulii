const express = require('express')
const router = express.Router()
const store = require('../data/store')

router.get('/:username', async (req, res, next) => {
    if (!req.session.user) return res.redirect("/")
    let payLoad = getPayload(req.params.username, req.session.user)
    res.status(200).render("profilePage", payLoad)
})

router.get('/:username/replies', async (req, res, next) => {
    if (!req.session.user) return res.redirect("/")
    let payLoad = getPayload(req.params.username, req.session.user)
    payLoad.selectedTab = "replies"
    res.status(200).render("profilePage", payLoad)
})

router.get('/:username/following', async (req, res, next) => {
    if (!req.session.user) return res.redirect("/")
    let payLoad = getPayload(req.params.username, req.session.user)
    payLoad.selectedTab = "following"
    res.status(200).render("followPage", payLoad)
})

router.get('/:username/followers', async (req, res, next) => {
    if (!req.session.user) return res.redirect("/")
    let payLoad = getPayload(req.params.username, req.session.user)
    payLoad.selectedTab = "followers"
    res.status(200).render("followPage", payLoad)
})

function getPayload(username, userLoggedIn) {
    let user = store.getUserByUsername(username)
    if (!user) {
        user = store.getUserById(username)
    }
    if (!user) {
        return {
            pageTitle: "User Not Found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn)
        }
    }
    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}

module.exports = router
