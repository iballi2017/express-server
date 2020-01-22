
const express = require('express');
const app = express();



//To make sure image url is publicly available
app.use('/uploads', express.static('uploads'));


//Install a body extracting package called "body-parser" ==> npm install --save body-parser
const bodyParser = require("body-parser");
//To use body-parser
//"true" allows you to parse extended body with rich data in it. We put this bodyparser to false
//to support simple body for url-encoded data
app.use(bodyParser.urlencoded({extended: false}));
//The body-parser code below applies json as a method without argument
//This will extract json data and makes it easily readable
app.use(bodyParser.json());


//solving CORS errors with middleware
const cors = require('cors');
app.use(cors());


const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
//import user route
const userRoutes = require('./api/routes/users');



// route instances
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
//Routes that will handle user requests
app.use('/users', userRoutes);



//To handle errors
app.use((req, res, next) =>{
    const error = Error("Request not found!");
    error.status = 404;
    next(error);
})

//For other errors
app.use((error, req, res, next) =>{
    res.status(error.status || 404);
    res.json({
        error: {
            message: error.message
        }
    })
})



module.exports = app;