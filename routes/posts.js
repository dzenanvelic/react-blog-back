const router = require('express').Router()
const User = require('../models/User')
const Post = require('../models/Post')
const verify = require('../verifyToken')

//create post
router.post('/',verify,async(req,res)=>{
    const newPost = new Post(req.body)
try {
    const post = await newPost.save()
    res.status(200).json(post)
} catch (error) {
    console.log("POST CREATE ERROR",error);
    res.status(500).json(error)
}
})


//UPDATE post 
router.put('/:id',async(req,res)=>{
try {
    const post =await Post.findById(req.params.id)
    //console.log("POST",post);
    if(post.username === req.body.username ){
try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
    res.status(200).json(updatedPost)
} catch (error) {
   console.log("UPDATE POST ERROR",error);
   res.status(500).json(error)
}
    }else{
         res.status(401).json("you can update only your post")
    }
} catch (error) {
    res.status(500).json(error)
}
})
//DELETE post 
router.delete('/:id',async(req,res)=>{
try {
    const post = await Post.findById(req.params.id)
if(post.username === req.body.username  ){
     try {
        await post.delete()
        res.status(200).json("Post successfuly deleted")
    } catch (error) {
       res.status(500).json(error)
    }
}else{
     res.status(401).json("You can delete only your posts") 
}
   
} catch (error) {
    res.status(500).json(error)
}
})

//get post
router.get('/find/:id',async(req,res)=>{
try {
    const post =await  Post.findById(req.params.id)
    
       
        res.status(200).json(post)
    }
 catch (error) {
    console.log("POSTFIND ERROR",error);
    res.status(500).json("ERROR POST FIND",error)
}
})
//get all posts
router.get('/findall',async(req,res)=>{
    try {
        const username = req.query.user;
        const catName = req.query.cat;
        let posts;
        if(username){
            posts = await Post.find({username})
        }else if(catName){
            posts = await Post.find({categories:{$in:[catName]}})
        }else{
            posts =await Post.find().sort({createdAt:-1})
        }
        res.status(200).json(posts)
    } catch (error) {
        console.log("POSTS FIND ERR",error);
        res.status(500).json("POSTS FIND ERROR",error)
    }



})
module.exports= router