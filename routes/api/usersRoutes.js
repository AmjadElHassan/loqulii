const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const Post = require('../../schemas/PostSchema.js')
const User = require('../../schemas/UserSchema.js')
let bcrypt = require("bcrypt")
const session = require('express-session')
const multer = require('multer')
const upload = multer({ dest: "uploads/" })
const path = require("path")
const fs = require('fs')

app.use(bodyParser.urlencoded({ extended: false }))

router.put('/:userId/follow', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    try {

        let currentUser = req.session.user
        if (!currentUser) return res.sendStatus(200).redirect('/')

        let user2FollowId = req.params.userId

        let user2Follow = await User.find({ _id: user2FollowId })

        if (!user2Follow) {
            return res.sendStatus(404)
        }

        if (user2Follow.length != 1) {
            return res.sendStatus(404).send('multiple users found')
        }

        user2Follow = user2Follow[0]


        let isFollowing = user2Follow.followers !== undefined && user2Follow.followers.includes(currentUser._id)
        let option = isFollowing ? "$pull" : "$addToSet"
        console.log(user2Follow, currentUser._id)
        req.session.user = await User.findByIdAndUpdate(currentUser._id, { [option]: { following: user2FollowId } }, { new: true })
        user2Follow = await User.findByIdAndUpdate(user2FollowId, { [option]: { followers: currentUser._id } }, { new: true })

        res.status(200).send(req.session.user)
    }
    catch (err) {
        console.log(err)
        res.status(404)
    }
})

router.get('/:userId/followers', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    try {
        let profileUser = await User.findById(req.params.userId).populate("followers")
        // let followerList = await User.populate(profileUser,{path: })
        res.status(202).send(profileUser)
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Could not retrieve follower list")
    }
})
router.get('/:userId/following', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    try {
        let profileUser = await User.findById(req.params.userId).populate("following")
        // let followerList = await User.populate(profileUser,{path: })
        res.status(202).send(profileUser)
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Could not retrieve follower list")
    }
})

router.post('/profilePicture', upload.single("croppedImage"), async (req, res, next) => {
    try {
        if (!req.file) {
            console.log('no file uploaded')
            res.sendStatus(400)
        }

        let filePath = `/uploads/images/${req.file.filename}.png`
        let tempPath = req.file.path

        let targetPath = path.join(__dirname, `../../${filePath}`)

        fs.rename(tempPath, targetPath,async error => {
            if (error != null) {
                console.log(error);
                return res.status(400)
            }

            req.session.user = await User.findByIdAndUpdate(req.session.user._id, { profilePic: filePath }, {new: true})
            res.status(204)
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).send("profile picture upload failed")
    }
})

module.exports = router