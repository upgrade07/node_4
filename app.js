const express = require('express')
const app = express()
const auth = require("./routes/auth")

app.use(express.json())
app.use('/auth',auth)
app.get('/',function(req,res){
    res.send("Its working!")
})

app.listen(5000,()=>{
    console.log('listening')
})