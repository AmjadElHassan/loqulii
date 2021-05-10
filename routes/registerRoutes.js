let express = require('express')
const app = express()
const router = express.Router()

app.set("view engine", "pug")
app.set("views","views")

router.get('/', (req,res,next)=>{//we configured the router to handle requests at root "/" 
    res.status(200).render("register")//to load the login interface
})


module.exports = router