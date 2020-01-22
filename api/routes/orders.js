
const express = require('express');
const app = express();
const router = express.Router();

//USING order.js model
//Import mongoose
const mongoose = require('mongoose');
//import the order model schema here
const Order = require('../model/order');

//import the product model schema
const Product = require('../model/product');




router.post('/', (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            //..............................
            //Validation
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found!'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
                .then(result => {
                    console.log(result);
                    // res.status(201).json(result)
                    res.status(201).json({
                        message: 'Order stored',
                        reatedCreated: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: 'http//localhost:3000/orders' + result.id
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            //..............................
        })
        .catch(err => {
            res.status(500).jason({
                message: 'Product not found!',
                error: err
            })
        })

})

router.get('/', (req, res, next) => {

    //To find and view all orders
    Order.find()
        //to select the variable info concerned
        .select('product quantity _id')  //to state which fields to select and display on the screen, without it, all fields will be displayed
        .exec()
        .then(docs => {
            // res.status(200).json(docs);
            res.status(200).json({
                cont: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:9000/products/' + doc._id
                        }
                    }
                })
            });    //return an object with addition information
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

router.get('/:orderId', (req, res, next) => {

    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            //..................................................
            //NOTE: When trying to GET an already deleted order, the system returns 'null'
            //To get a reasonable response, the 'if statement' below is applied
            if (!order) {
                res.status(404).json({
                    message: 'Order not found!'
                })
            }
            //.................................................
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})


router.delete('/:orderId', (req, res, next) => {
    
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted!',
            //a request response is sent to the user to make a new order with information ('productID' and 'quantity')
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: { productId: 'ID', quantity: 'Number'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})



app.use((req, res, next) => {
    // console.log("Server works");
    res.status(200).json({
        Firstname: "Ibrahim",
        Middlename: "Abayomi",
        Lastname: "Alli",
        Age: 90,
    });
});

module.exports = router;