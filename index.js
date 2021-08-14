const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const authRoute = require('./routes/auth') ;
const userRoute = require('./routes/users') ;
const postRoute = require('./routes/posts') ;
const categoryRoute = require('./routes/categories') ;
const multer = require('multer')
const path = require('path') 
 dotenv.config();

mongoose.connect(process.env.MONGO_DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true,
}
    
    ).then(res=>console.log("Mongo database for blog connected"))
    .catch(error=>{
        console.log("MONGO DB ERROR", error);
    })
//middlevares
app.use(express.json());
app.use(morgan('dev'));
app.use("/images",express.static(path.join(__dirname,"/images")))
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },filename:(req,file,cb)=>{
cb(null,req.body.name)
    }
})
const upload = multer({storage:storage})
app.post("/api/upload",upload.single('file'),(req,res)=>{
    res.status(200).json("File has been uploaded")
})
    //routes
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/posts',postRoute);
app.use('/api/categories',categoryRoute);


app.listen(port,()=>{
    console.log(`Server runs on port ${port}`);
})