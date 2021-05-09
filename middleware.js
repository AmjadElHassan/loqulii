//as middleware be aware that this is occuring before the callback function of the request is initialized

exports.requireLogin = (req,res,next)=>{
    if (req.session && req.session.user){//req.session.user will not exist until user is logged in
        return next()
    } else {//if they are not logged in, redirect them to the login page
        return res.redirect('/login')
    }
}