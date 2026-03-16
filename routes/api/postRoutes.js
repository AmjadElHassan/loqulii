const express = require('express')
const router = express.Router()
const store = require('../../data/store')

router.get('/', async (req, res, next) => {
    let query = req.query
    let allPosts = store.getAllPosts()

    // Filter: isReply
    if (query.isReply !== undefined) {
        let isReply = (query.isReply === "true")
        allPosts = allPosts.filter(p => isReply ? p.replyTo != null : p.replyTo == null)
    }

    // Filter: followingOnly
    if (query.followingOnly === "true") {
        let following = [...(req.session.user.following || []), req.session.user._id]
        allPosts = allPosts.filter(p => following.includes(p.postedBy._id))
    }

    // Filter: postedBy
    if (query.postedBy) {
        allPosts = allPosts.filter(p => p.postedBy._id === query.postedBy)
    }

    // Filter: search (regex on content)
    if (query.search) {
        let re = new RegExp(query.search, "i")
        allPosts = allPosts.filter(p => p.content && re.test(p.content))
    }

    // Filter: pinned
    if (query.pinned !== undefined) {
        let pinned = (query.pinned === "true" || query.pinned === true)
        allPosts = allPosts.filter(p => !!p.pinned === pinned)
    }

    res.status(200).send(allPosts)
})

router.get('/:id', async (req, res, next) => {
    try {
        let postData = store.getPostById(req.params.id)
        if (!postData) return res.sendStatus(404)

        let results = { postData: postData }

        if (postData.replyTo) {
            results.replyTo = postData.replyTo
        }

        // Get replies to this post
        let allPosts = store.getAllPosts()
        results.replies = allPosts.filter(p => p.replyTo && p.replyTo._id === req.params.id)

        res.status(200).send(results)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

router.post('/', async (req, res, next) => {
    try {
        let newPost = store.createPost({
            content: req.body.content,
            postedBy: req.session.user._id,
            replyTo: req.body.replyTo || null,
        })
        res.status(201).send(newPost)
    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

router.put('/:id/like', async (req, res, next) => {
    let postId = req.params.id
    let userId = req.session.user._id

    let isLiked = req.session.user.likes && req.session.user.likes.includes(postId)

    // Toggle on raw user
    let rawUser = store._getRawUser(userId)
    let rawPost = store._getRawPost(postId)
    if (!rawUser || !rawPost) return res.sendStatus(400)

    if (isLiked) {
        rawUser.likes = rawUser.likes.filter(id => id !== postId)
        rawPost.likes = rawPost.likes.filter(id => id !== userId)
    } else {
        if (!rawUser.likes.includes(postId)) rawUser.likes.push(postId)
        if (!rawPost.likes.includes(userId)) rawPost.likes.push(userId)
    }

    req.session.user = store.getUserById(userId)
    let post = store.getPostById(postId)
    res.status(200).send(post)
})

router.put('/:id', async (req, res, next) => {
    try {
        if (req.body.pinned !== undefined) {
            store.unpinAllByUser(req.session.user._id)
        }
        store.updatePost(req.params.id, req.body)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.status(400).send('failed to pin')
    }
})

router.post('/:id/retweets', async (req, res, next) => {
    let postId = req.params.id
    let userId = req.session.user._id

    let rawUser = store._getRawUser(userId)
    let rawPost = store._getRawPost(postId)
    if (!rawUser || !rawPost) return res.sendStatus(400)

    // Check for existing retweet
    let allPosts = store.getAllPosts()
    let existingRetweet = allPosts.find(p => p.postedBy._id === userId && p.retweetData && p.retweetData._id === postId)

    if (existingRetweet) {
        // Un-retweet: delete the retweet post, pull from user and original post
        store.deletePost(existingRetweet._id)
        rawUser.retweets = rawUser.retweets.filter(id => id !== existingRetweet._id)
        rawPost.retweetUsers = rawPost.retweetUsers.filter(id => id !== userId)
    } else {
        // Retweet: create retweet post, add to user and original post
        let repost = store.createPost({ postedBy: userId, retweetData: postId })
        if (!rawUser.retweets.includes(repost._id)) rawUser.retweets.push(repost._id)
        if (!rawPost.retweetUsers.includes(userId)) rawPost.retweetUsers.push(userId)
    }

    req.session.user = store.getUserById(userId)
    let post = store.getPostById(postId)
    res.status(200).send(post)
})

router.delete('/:id', async (req, res, next) => {
    try {
        store.deletePost(req.params.id)
        res.sendStatus(202)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

module.exports = router
