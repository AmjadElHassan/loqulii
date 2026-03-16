const express = require('express')
const router = express.Router()
const store = require('../../data/store')

router.get('/', async (req, res, next) => {
    try {
        let userId = req.session.user._id
        let allChats = store.getChats()
        let results = allChats
            .filter(c => c.users.some(u => u && u._id === userId))
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        res.status(200).send(results)
    } catch (err) {
        console.log("cannot retrieve Chats: " + err)
        res.sendStatus(400)
    }
})

router.post('/', async (req, res, next) => {
    try {
        if (!req.body.content || !req.body.chatId) {
            console.log('bad request')
            return res.sendStatus(400)
        }

        let newMessage = store.createMessage({
            sender: req.session.user._id,
            content: req.body.content,
            chat: req.body.chatId,
        })
        res.status(201).send(newMessage)
    }
    catch (err) {
        console.log("server Error: " + err)
        res.sendStatus(400)
    }
})

module.exports = router
