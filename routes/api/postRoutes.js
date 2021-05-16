let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const Post = require('../../schemas/PostSchema.js')
const User = require('../../schemas/UserSchema.js')
let bcrypt = require("bcrypt")
const session = require('express-session')


app.use(bodyParser.urlencoded({ extended: false }))


router.get('/', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    try {
        let response = await Post.find().populate("postedBy")
        .populate("retweetData")
        .sort({ "createdAt": -1 })
        await User.populate(response, {path: "retweetData.postedBy"})
        res.status(200).send(response)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }
})

router.post('/', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    if (!req.body.content) {
        console.log("content param of request not received");
        return res.sendStatus(400)
    }
    let postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    try {
        let newPost = await Post.create(postData)
        let populatedNewPost = await User.populate(newPost, { path: "postedBy" })
        res.status(201).send(populatedNewPost)
    } catch (err) {
        console.log(`asynchronous server response: ${err}`)
        return res.sendStatus(400)
    }
})

router.put('/:id/like', async (req, res, next) => {
    let postId = req.params.id//we receive the post information for the post being liked
    let userId = req.session.user._id

    let isLiked = req.session.user.likes && req.session.user.likes.includes(postId)

    let option = isLiked ? "$pull" : "$addToSet"
    //insert user like
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
    //insert post like
    let post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true })
    res.status(200).send(post)
})

router.post('/:id/retweets', async (req, res, next) => {
    let postId = req.params.id//we receive the post information for the post being liked
    let userId = req.session.user._id

    //try and delete retweet
    let deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
        .catch(err => {
            console.log(err)
            res.status(400)
        })

    let option = deletedPost != null ? "$pull" : "$addToSet";

    let repost = deletedPost;

    if (repost == null) {
        repost = await Post.create({ postedBy: userId, retweetData: postId })
            .catch(err => {
                console.log(err)
                res.status(400)
            })
    }
    //recording our retweet to our User/removing it. depends on option
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
    //recording/removing the user to the list of users who retweeted on the Post 
    let post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })

    res.status(200).send(post)

    // res.status(200).send(postId)


    // let option = isLiked ? "$pull" : "$addToSet"
    // //insert user like
    // req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId } }, {new: true})
    // .catch((err)=>{console.log(err)
    // res.sendStatus(400)})
    // //insert post like
    // let post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId } },{new:true})
    // res.status(200).send(post)
})



module.exports = router