const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

//Register
router.post('/register',async(req,res)=>{
const newUser = new User({
    username:req.body.username,
    email:req.body.email,
    password:CryptoJS.AES.encrypt(req.body.password,
        process.env.SECURE_KEY).toString()
})
try {
    const user = await newUser.save()
    res.status(201).json(user)
} catch (error) {
    console.log("USER CREATE ERROR",error);
    res.status(500).json(error)
}

})

router.post('/login',async(req,res)=>{
try {
    const user = await User.findOne({email:req.body.email})
    !user && res.status(401).json("Wrong password or username")
    const bytes = CryptoJS.AES.decrypt(user.password,process.env.SECURE_KEY)
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8)
    originalPassword !== req.body.password && res.status(401).json("Wrong password or username")
    const accessToken= jwt.sign({id:user._id, isAdmin:user.isAdmin},process.env.SECURE_KEY,{expiresIn:"7d"})
    const{password, ...other} = user._doc
res.status(200).json({...other, accessToken})
} catch (error) {
    console.log("FINDING USER ERROR",error);
    res.status(500).json(error)
}
})

module.exports= router