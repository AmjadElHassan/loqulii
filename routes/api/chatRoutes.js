const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const Post = require('../../schemas/PostSchema.js')
const User = require('../../schemas/UserSchema.js')
const Chat = require('../../schemas/ChatSchema.js')
const Message = require('../../schemas/MessageSchema.js')
let bcrypt = require("bcrypt")
const session = require('express-session')
const multer = require('multer')
const upload = multer({ dest: "uploads/" })
const path = require("path")
const fs = require('fs')

app.use(bodyParser.urlencoded({ extended: false }))

router.get('/', async (req, res, next) => {
    try {
        let results = await Chat.find({
            users: {
                $elemMatch: //return the elements of an array that match the following condition
                    { $eq: req.session.user._id } //where any value within that element is equal to: our user id
            }
        })
        .populate("users")
        .populate("latestMessage")
        .sort({ updatedAt: "desc" })

        results = (await User.populate(results, {path: "latestMessage.sender"}))

        res.status(200).send(results)
    } catch (err) {
        console.log("cannot retrieve Chats from Db: " + err)
        res.sendStatus(400)
    }
})

router.get('/:chatId', async (req, res, next) => {
    try {
        let results = await Chat.findOne({_id: req.params.chatId,
            users: {
                $elemMatch: //return the elements of an array that match the following condition
                    { $eq: req.session.user._id } //where any value within that element is equal to: our user id
            }
        })
        .populate("users")
        .sort({ updatedAt: "desc" })
        res.status(200).send(results)
    } catch (err) {
        console.log("cannot retrieve Chats from Db: " + err)
        res.sendStatus(400)
    }
})

router.get('/:chatId/messages', async (req, res, next) => {
    try {
        let results = await Message.find({chat: req.params.chatId})
        .populate("sender")
        // .sort({ updatedAt: "-1" })
        res.status(200).send(results)
    } catch (err) {
        console.log("cannot retrieve Chats from Db: " + err)
        res.sendStatus(400)
    }

})

router.post('/', async (req, res, next) => {
    try {
        if (!req.body.users) {
            console.log('no request body received')
            return res.sendStatus(400)
        }
        let chatMembers = await JSON.parse(req.body.users)
        await chatMembers.push(req.session.user)

        let chatData = {
            isGroupChat: true,
            users: chatMembers,
        }

        let newChat = await Chat.create(chatData)

        res.status(201).send(newChat)
    }
    catch (err) {
        console.log("server Error: " + err)
        res.sendStatus(400)
    }
})

// router.post('/messages/:id', async (req, res, next) => {
//     let chatMembers = req.body
//     res.status(200).send(chatMembers[0])
// })

router.put('/:chatId', async (req, res, next) => {
    try{
        let chatNameUpdate = await Chat.findByIdAndUpdate(req.params.chatId, req.body)
        await res.sendStatus(204)
    }
    catch(err){
        console.log(err)
        res.sendStatus(400)
    }
})

module.exports = router