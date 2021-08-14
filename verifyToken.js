const jwt = require('jsonwebtoken')

function verify(req,res,next){
const authHeader = req.headers.token
if(authHeader){
    const token = authHeader.split(" ")[1]

    jwt.verify(token,process.env.SECURE_KEY,(err,user)=>{
        if(err)res.status(403).json("TOKEN is invalid")
        req.user = user
        next()
    })
}else{
    res.status(401).json("You are not authenticated")
}
}

module.exports=verify