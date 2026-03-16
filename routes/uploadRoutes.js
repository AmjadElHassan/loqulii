let express = require('express')
const router = express.Router()
const path = require('path')


router.get('/images/:path', async (req, res, next) => {//we configured the router to handle requests at root "/" 
    res.sendFile(path.join(__dirname,`../uploads/images/${req.params.path}`))
})

module.exports = router