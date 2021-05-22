let express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const Post = require('../../schemas/PostSchema.js')
const User = require('../../schemas/UserSchema.js')
let bcrypt = require("bcrypt")
const session = require('express-session')


app.use(bodyParser.urlencoded({ extended: false }))


router.get('/:id',async (req,res,next)=>{
    try{
        let postData = await getPosts({_id: req.params.id})
        if (postData.length==1){
            postData = postData[0]
        }

        let results = {
            postData: postData,
        }
        
        if (postData.replyTo){
            console.log('yes')
            results.replyTo = postData.replyTo
        }

        results.replies = await getPosts({replyTo: req.params.id})
        
        res.status(200).send(results)
    }
    catch(err){
        console.log(err)
        res.status(400)
    }
})

router.get('/', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    let searchObj = req.query;
    console.log(searchObj)

    if (searchObj.isReply){
        let isReply = (searchObj.isReply=="true")
        searchObj.replyTo = {$exists: isReply}
        delete searchObj.isReply
    }

    if (searchObj.followingOnly){
        let onlyFollowingPosts = (searchObj.followingOnly == 'true')
        if (onlyFollowingPosts){
            searchObj.postedBy = req.session.user.following
        }
        delete searchObj.followingOnly
    }
    console.log(searchObj)
    let results = await getPosts(searchObj)    
    res.status(200).send(results)
})

router.post('/', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    console.log(req.body.content)
    let postData = {
        content: req.body.content,
        postedBy: req.session.user,
        replyTo: req.body.replyTo
    }
    console.log(postData)

    try {
        let newPost = await Post.create(postData)
        let populatedNewPost = await User.populate(newPost, { path: "postedBy" })
        await Post.populate(newPost, {path: "replyTo"})
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
})

router.delete('/:id', async(req,res,next)=>{
    try{
        let postId = {_id: req.params.id}
        let post = await Post.findOneAndDelete(postId)
        console.log(post)
        res.sendStatus(202)
    }
    catch(err){
        console.log(err)
        res.status(400)
    }
})

async function getPosts(searchObject){
    try {
        let IdCheck = searchObject!==undefined ?
         searchObject:
         null;
        let results = await Post.find(searchObject)
        .populate("postedBy")
        .populate("retweetData")
        .populate("replyTo")
        .sort({ "createdAt": -1 })
        
    results = await User.populate(results, {path: "replyTo.postedBy"})
     return await User.populate(results, {path: "retweetData.postedBy"})
    }
    catch (err) {
        console.log(err)
    }
}



module.exports = router