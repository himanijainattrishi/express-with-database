const express=require('express');
require('./config/dbConfig.js')
const Product=require('./models/productModel.js')
const app=express();
app.use(express.json());

app.post("/api/v1/products",async(req,res)=>{
    try{
        const newProduct=req.body;
        const doc=await  Product.create(newProduct)
        res.status(201);
        res.json({
          status: "success",
          data : doc,
        });
    }
    catch(err){
        //console.log(Object.keys(err))
        console.log(err.name)
       if (err.name==='ValidationError') {
        res.status(400).json({
            status:'fail',
            message: "data validation failed",
        })
       }
       else
       {
        res.status(500).json({
            status:'fail',
            message:'Internal Server Error',
        })
       }

       }
    
  
})
app.listen(1100,()=>{
    console.log("server is started");
})

