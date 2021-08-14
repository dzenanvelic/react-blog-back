const router = require('express').Router()
const Category = require('../models/Category')


//create cat
router.post('/',async(req,res)=>{
    const newCat = new Category(req.body)
    try {
        const createdCat = await newCat.save()
        res.status(200).json(createdCat)
    } catch (error) {
        res.status(500).json("CATEGORY CREATE ERROR",error)
    }
})

//get all cat
router.get('/allcat',async(req,res)=>{
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        console.log("CAT FETCH ERROR",error);
        res.status(500).json("CATEGORIES FETCH ERROR",error)
    }
})

module.exports= router