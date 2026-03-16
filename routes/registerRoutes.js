const express = require('express')
const router = express.Router()
const store = require('../data/store')

router.get('/', (req, res, next) => {
    res.status(200).render("register")
})

router.post('/', async (req, res, next) => {
    try {
        let firstName = req.body.firstName && req.body.firstName.trim()
        let lastName = req.body.lastName && req.body.lastName.trim()
        let username = req.body.username && req.body.username.trim()
        let email = req.body.email && req.body.email.trim()
        let password = req.body.password

        let payload = req.body

        if (firstName && lastName && username && email && password) {
            let existingUser = store.getUserByUsername(username) || store.getUserByEmail(email)

            if (existingUser == null) {
                let newUser = store.createUser({ firstName, lastName, username, email, password })
                req.session.user = newUser
                return res.redirect('/')
            } else {
                if (email == existingUser.email) {
                    payload.errorMessage = "Email already In use."
                } else {
                    payload.errorMessage = "Username already In use."
                }
                return res.status(200).render("register", payload)
            }
        }
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router
