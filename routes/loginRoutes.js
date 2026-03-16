const express = require('express')
const router = express.Router()
const store = require('../data/store')

router.get('/', (req, res, next) => {
    res.status(200).render("login")
})

router.post('/', async (req, res, next) => {
    let payload = req.body

    let username = payload.logUsername && payload.logUsername.trim()
    let password = payload.logPassword
    if (username && password) {
        let user = store.getUserByUsername(username)

        if (user != null) {
            if (password === user.password) {
                req.session.user = user
                return res.redirect('/')
            }
            payload.errorMessage = "Please re-enter pasword"
            return res.status(200).render("login", payload)
        }
        payload.errorMessage = "User not found"
        return res.status(200).render("login", payload)
    }

    payload.errorMessage = "Confirm each field contains only valid characters"
    res.status(200).render("login")
})

module.exports = router
