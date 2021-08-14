const router = require('express').Router()
const User = require('../models/User')
const Post = require('../models/Post')
const verify = require('../verifyToken')
const CryptoJS = require('crypto-js')

//UPDATE
router.put('/:id',verify,async(req,res)=>{
if(req.user.id === req.params.id || req.user.isAdmin){
if(req.body.password){
req.body.password = await CryptoJS.AES.encrypt(req.body.password, process.env.SECURE_KEY).toString()

}
try {

    const updatedUser = await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    res.status(200).json(updatedUser)
   
} catch (error) {
    console.log("USER UPDATE ERROR",error);
    res.status(500).json(error)
}
}else{
    res.status(403).json("You can update only your account")
}
})
//DELETE
router.delete('/:id',verify,async(req,res)=>{
if(req.user.id === req.params.id || req.user.isAdmin){
    try {
        const user = await User.findById(req.params.id)
    
    try {
        await Post.deleteMany({username:user.username})
   await User.findByIdAndDelete(req.params.id)
   
   res.status(200).json("User successfuly deleted..."
    )
    } catch (error) {
    console.log("USER DELETE ERROR",error);
    res.status(500).json(error)
}} catch (error) {
        res.status(404).json("User not found")
    }
}else{
    res.status(403).json("You are not authorized")
}


})

//getUser
router.get('/find/:id',async(req,res)=>{
try {
    const user =await  User.findById(req.params.id)
    if(!user){
        res.status(404).json("User not found in database")
    }else{
        const{password, ...other}=user._doc
        res.status(200).json(other)
    }
} catch (error) {
    console.log("USER FIND ERROR",error);
    res.status(500).json("ERROR USER FIND",error)
}
})

module.exports= router