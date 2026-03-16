const express = require('express')
const router = express.Router()
const store = require('../data/store')

router.get('/', async (req, res, next) => {
    let payLoad = {
        pageTitle: "Inbox",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.status(200).render("mailPage", payLoad)
})

router.get('/new', async (req, res, next) => {
    let payLoad = {
        pageTitle: "New Message",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.status(200).render("newMessage", payLoad)
})

router.get('/:chatId', async (req, res, next) => {
    try {
        let userId = req.session.user._id
        let chatId = req.params.chatId

        let payLoad = {
            pageTitle: "Chat",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(req.session.user),
        }

        // Check if chatId is a known chat
        let chat = store.getChatById(chatId)
        if (chat && chat.users.some(u => u && u._id === userId)) {
            payLoad.chat = chat
            return res.status(200).render("chatPage", payLoad)
        }

        // Check if chatId is actually a userId — find or create DM
        let otherUser = store.getUserById(chatId)
        if (otherUser) {
            chat = store.findDMChat(userId, otherUser._id)
            if (!chat) {
                chat = store.createChat({
                    isGroupChat: false,
                    users: [userId, otherUser._id],
                })
            }
            payLoad.chat = chat
            return res.status(200).render("chatPage", payLoad)
        }

        payLoad.errorMessage = "chat does not exist or you do not have proper permissions"
        res.status(200).render("chatPage", payLoad)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

module.exports = router
