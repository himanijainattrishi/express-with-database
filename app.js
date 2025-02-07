const express = require('express');

const morgan = require('morgan')// it will print whole data to console when we use postman it will print 
//whole data to console.
require('./config/dbConfig.js')
const Product = require('./models/productModel.js')
const user = require('./models/userModel.js');
const bcrypt = require('bcrypt')// npm i bcrypt
const OTP = require('./models/otpModel.js');
const { sendEmail } = require("./utils/emailHelper.js")
const app = express();
const cors = require('cors')
app.use(cors())
// it will print request has recived
app.use((req, res, next) => {
    console.log("-> Request received", req.url)
    next();
})

app.use(morgan());
app.use(express.json());// it returen middle wareand read body(req.body)

app.post("/api/v1/products", async (req, res) => {
    try {
        const newProduct = req.body;
        const doc = await Product.create(newProduct)
        res.status(201);// It is created successfully

        res.json({
            status: "success",
            data: doc,
        });
    }
    catch (err) {
        //console.log(Object.keys(err))
        console.log(err.name)
        if (err.name === 'ValidationError') {
            res.status(400).json({
                status: 'fail',
                message: "data validation failed",
            })
        }
        else {
            res.status(500).json({
                status: 'fail',
                message: 'Internal Server Error',
            })
        }

    }


})

//Read Operations
// app.get("/api/v1/products", async (req, res) => {
//     try {
//         const data = await Product.find();
//         res.json({
//             status: "success",
//             data: data,

//         })
// }
//     catch (err) {
//         res.status(500).json({
//             status: 'fail',
//             message: 'Internal Server Error',
//         })
//     }
// })

//Search product

// app.get("/api/v1/products", async (req, res) => {
//     try {
//         const {q=""}=req.query
//         console.log(q)
//         const productQuery = Product.find();
//         if(q.length>0){
//             const reg=new RegExp(q,"i")// I means insenstive ignore case captial and small
//             console.log(reg)
//             productQuery.where('title').regex(reg)
//         }
//         const products=await productQuery;
//         res.json({
//             status: "success",
//             data: products,

//         })
// }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).json({
//             status: 'fail',
//             message: 'Internal Server Error',
//         })
//     }
// })
//for run in postman in get http://localhost:1100/api/v1/products?q=z 
//http://localhost:1100/api/v1/products?q=tc
// we applied in title search. q means query we find which title is tcs. that'why we use tc whose title is tc , then all record will print
// q=z means query whose title is z come. product will print




//pagination

//http://localhost:1100/api/v1/products?q=tc&size=2
//fields="-_id -__v -createdAt -updatedAt (dont want to see these fields)
app.get("/api/v1/products", async (req, res) => {
    try {
        const { q = "", size = 10, page = 1, fields = "-_id -__v -createdAt -updatedAt" } = req.query

        console.log(q)
        const productQuery = Product.find();
        if (q.length > 0) {
            const reg = new RegExp(q, "i")// I means insenstive ignore case captial and small
            console.log(reg)
            productQuery.where('title').regex(reg)
        }
        productQuery.sort("price -title")// ascending mai price and descending mai title show hoga
        const productQueryClone = productQuery.clone();
        productQuery.skip((page - 1) * size);
        productQuery.limit(size)
        productQuery.select(fields)
        const products = await productQuery;
        const totalProducts = await productQueryClone.countDocuments();
        res.json({
            status: "success",
            data: products,
            total: totalProducts,

        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({
            status: 'fail',
            message: 'Internal Server Error',
        })
    }
})

//for postman
// {

//     "email":"shalu@gmail.com",
//     "name": "shalu",
//     "password":"abes"
//     }

//for user Register
app.post("/api/v1/user/Register", async (req, res) => {
    try {
        const userInfo = req.body;
        // if(userInfo.password.length<=7){
        //     res.status(400);
        // }
        const salt = await bcrypt.genSalt(14); // create number like 2^14.for creating password
        const hashedPassword = await bcrypt.hash(userInfo.password, salt);
        userInfo.password = hashedPassword;
        console.log(user)

        const userdata = await user.create(userInfo);
        res.status(201);// It is created successfully

        res.json({
            status: "success",
            data: userdata,
        });
    }
    catch (err) {
        console.log(err.message)

        if (err.code == 11000 || err.name === 'ValidationError') {
            res.status(400).json({
                status: 'fail',
                message: "data validation failed" + err.message
            });
        }
        else {
            res.status(500).json({
                status: 'fail',
                message: 'Internal Server Error',
            })
        }


    }

}
);

//first we have to go google manage account
// 2 step verification
// search-> app password

//for OTP
// for postman: http://localhost:1100/api/v1/otps
// now check body raw. and {
   // "email" : "himanijain1987ap@gmail.com"
//}
app.post("/api/v1/otps", async (req, res) => {
    try {

        const { email } = req.body;
        //email is required
       
        if (email && email.length > 0) {
            const otp = Math.floor(Math.random() * 9000 + 1000);
            const isEmailSent = await sendEmail(email, otp);
            if (isEmailSent) {
                const hashedOtp=await bcrypt.hash(otp.toString(),14)
                await OTP.create({email,otp:hashedOtp});
                res.status(201).json({
                    status: "success",
                    message: "OTP has been sent successfully",

                })
            }
            else {
                res.status(500).json({
                    status: 'fail',
                    message: "Failed to send OTP"
                });

            }

        }
        else {
            res.status(400).json({
                status: 'fail',
                message: "email is required"
            });
            //return;
        }


    }
    catch (err) {
        console.log(err.message)

        if (err.code == 11000 || err.name === 'ValidationError') {
            res.status(400).json({
                status: 'fail',
                message: "data validation failed" + err.message
            });
        }
        else {
            res.status(500).json({
                status: 'fail',
                message: 'Internal Server Error',
            })
        }


    }

});


app.listen(1100, () => {
    console.log("server is started");
})

