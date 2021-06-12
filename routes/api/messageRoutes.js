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


router.post('/', async (req, res, next) => {
    try {
        if (!req.body.content||!req.body.chatId){
            console.log('bad request')
            res.sendStatus(400)
        }

        let newMessage = {
            sender: req.session.user._id,
            content: req.body.content,
            chat: req.body.chatId
        }

        const latest = await Message.create(newMessage)
        let metaLatest = await latest.populate("sender").execPopulate()
        metaLatest = await metaLatest.populate("chat").execPopulate()
        metaLatest = await User.populate(latest, {path: "chat.users"})
        let newChatMessage = await Chat.findById(req.body.chatId).populate("latestMessage")
        newChatMessage = await newChatMessage.update({latestMessage: latest})
        res.status(201).send(metaLatest)
    }
    catch (err) {
        console.log("server Error: " + err)
        res.sendStatus(400)
    }
})


module.exports = router