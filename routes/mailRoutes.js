const express = require('express')
const mongoose = require('mongoose')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
const bcrypt = require("bcrypt")
const session = require('express-session')
const Chat = require('../schemas/ChatSchema')


router.get('/', async (req, res, next) => {//we configured the router to handle requests at root "/" 

    let payLoad = {
        pageTitle: "Inbox",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }

    res.status(200).render("mailPage", payLoad)

})

router.get('/new', async (req, res, next) => {//we configured the router to handle requests at root "/" 

    let payLoad = {
        pageTitle: "New Message",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }

    res.status(200).render("newMessage", payLoad)

})

router.get('/:chatId', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    try {
        let userId = req.session.user._id
        let chatId = req.params.chatId
        let isValidId = mongoose.isValidObjectId(chatId)

        let payLoad = {
            pageTitle: "Chat",
            userLoggedIn: req.session.user,
            userLoggedInJs: JSON.stringify(req.session.user),
        }

        if (!isValidId) {
            payLoad.errorMessage = "chat does not exist or you do not have proper permissions"
            return res.status(200).render("chatPage", payLoad)
        }

        let chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: userId } } })
            .populate("users")


        if (chat == null) {
            let userFound = await User.findById(chatId)

            if (userFound != null) {
                //get chat using user id
                chat = await getChatbyUserId(userFound._id, userId)
            }
        }

        if (chat == null || chat == undefined) {
            payLoad.errorMessage = "chat does not exist or you do not have proper permissions"
        } else {
            payLoad.chat = chat
        }

        res.status(200).render("chatPage", payLoad)
    } catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

function getChatbyUserId(userLoggedIn, otherUserId) {
    return Chat.findOneAndUpdate({
        //first Object: filters for chats with only 2 people. 
        isGroupChat: false,
        users: {
            $size: 2,
            $all: [
                { $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedIn._id) } },
                { $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) } }
            ]
        }
    },
        //second object: if nothing returned from filter, the $setOnInsert option works with the upsert option below to create a new chat, specifically with the users i've designated below
        {
            $setOnInsert: {
                users: [userLoggedIn, otherUserId]
            }
        },
        //third object: return the new chat, post-database update. upsert, is the option that creates the new chat
        {
            new: true,
            upsert: true
        })
        .populate("users")
}

module.exports = router