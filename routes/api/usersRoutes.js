const express = require('express')
const router = express.Router()
const store = require('../../data/store')
const multer = require('multer')
const upload = multer({ dest: "uploads/" })
const path = require("path")
const fs = require('fs')

router.get('/', async (req, res, next) => {
    let searchObj = req.query

    if (searchObj.search) {
        let results = store.searchUsers(searchObj.search)
        return res.status(200).send(results)
    }

    // No search term — return empty (match original behavior of needing a query)
    res.status(200).send([])
})

router.put('/:userId/follow', async (req, res, next) => {
    try {
        let currentUser = req.session.user
        if (!currentUser) return res.sendStatus(401)

        let user2FollowId = req.params.userId
        let rawTarget = store._getRawUser(user2FollowId)
        let rawCurrent = store._getRawUser(currentUser._id)

        if (!rawTarget || !rawCurrent) return res.sendStatus(404)

        let isFollowing = rawTarget.followers && rawTarget.followers.includes(currentUser._id)

        if (isFollowing) {
            rawCurrent.following = rawCurrent.following.filter(id => id !== user2FollowId)
            rawTarget.followers = rawTarget.followers.filter(id => id !== currentUser._id)
        } else {
            if (!rawCurrent.following.includes(user2FollowId)) rawCurrent.following.push(user2FollowId)
            if (!rawTarget.followers.includes(currentUser._id)) rawTarget.followers.push(currentUser._id)
        }

        req.session.user = store.getUserById(currentUser._id)
        res.status(200).send(req.session.user)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(404)
    }
})

router.get('/:userId/followers', async (req, res, next) => {
    try {
        let user = store.getUserById(req.params.userId)
        if (!user) return res.sendStatus(404)
        user.followers = (user.followers || []).map(id => store.getUserById(id)).filter(Boolean)
        res.status(202).send(user)
    }
    catch (err) {
        console.log(err)
        res.status(400).send("Could not retrieve follower list")
    }
})

router.get('/:userId/following', async (req, res, next) => {
    try {
        let user = store.getUserById(req.params.userId)
        if (!user) return res.sendStatus(404)
        user.following = (user.following || []).map(id => store.getUserById(id)).filter(Boolean)
        res.status(202).send(user)
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
            return res.sendStatus(400)
        }

        let filePath = `/uploads/images/${req.file.filename}.png`
        let tempPath = req.file.path
        let targetPath = path.join(__dirname, `../../${filePath}`)

        fs.rename(tempPath, targetPath, async error => {
            if (error != null) {
                console.log(error)
                return res.sendStatus(400)
            }
            req.session.user = store.updateUser(req.session.user._id, { profilePic: filePath })
            res.sendStatus(204)
        })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

router.post('/coverPhoto', upload.single("croppedImage"), async (req, res, next) => {
    try {
        if (!req.file) {
            console.log('no file uploaded')
            return res.sendStatus(400)
        }

        let filePath = `/uploads/images/${req.file.filename}.png`
        let tempPath = req.file.path
        let targetPath = path.join(__dirname, `../../${filePath}`)

        fs.rename(tempPath, targetPath, async error => {
            if (error != null) {
                console.log(error)
                return res.sendStatus(400)
            }
            req.session.user = store.updateUser(req.session.user._id, { coverPhoto: filePath })
            res.sendStatus(204)
        })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

module.exports = router
