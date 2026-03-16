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

router.get('/:chatId', async (req, res, next) => {
    try {
        let userId = req.session.user._id
        let chat = store.getChatById(req.params.chatId)
        if (!chat || !chat.users.some(u => u && u._id === userId)) {
            return res.sendStatus(404)
        }
        res.status(200).send(chat)
    } catch (err) {
        console.log("cannot retrieve Chat: " + err)
        res.sendStatus(400)
    }
})

router.get('/:chatId/messages', async (req, res, next) => {
    try {
        let results = store.getMessages(req.params.chatId)
        res.status(200).send(results)
    } catch (err) {
        console.log("cannot retrieve messages: " + err)
        res.sendStatus(400)
    }
})

router.post('/', async (req, res, next) => {
    try {
        if (!req.body.users) {
            console.log('no request body received')
            return res.sendStatus(400)
        }
        let chatMembers = JSON.parse(req.body.users)
        chatMembers.push(req.session.user)

        let userIds = chatMembers.map(u => typeof u === 'string' ? u : u._id)

        let newChat = store.createChat({
            isGroupChat: true,
            users: userIds,
        })
        res.status(201).send(newChat)
    }
    catch (err) {
        console.log("server Error: " + err)
        res.sendStatus(400)
    }
})

router.put('/:chatId', async (req, res, next) => {
    try {
        store.updateChat(req.params.chatId, req.body)
        res.sendStatus(204)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

module.exports = router
