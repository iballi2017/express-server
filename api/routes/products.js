
const express = require('express');
const app = express();
const router = express.Router();
const Product = require('../model/product')
const mongoose = require('mongoose');


//import route protection middleware
const checkAuth = require('../middleware/check-auth'); //this middle ware is used on the POST, PATCH and DELETE blocks. We don't
//need to use it with the GET block cos every user is required to view all products


// multer for image upload
const multer = require('multer');
//.....................................................................
//alter a new constant 'upload' to execute multer
// const upload = multer({dest: 'uploads/'});  //'uploads' is a folder where multer will try to store incoming files
//.....................................................................
//A better to way to execute multer using 'multer.diskStorage()'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {    //cb means 'callback'
        cb(null, 'uploads/');  //'uploads' is a folder where multer will try to store incoming files
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().toISOString() + file.originalname); //..............//Is either you do this
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); //..............//Is either you do this, (this works for this project tho)
        // cb(null, Date.now() + file.originalname);   //..............................................or this
    }
});

// const upload = multer({storage: storage});


//additional filtering coming up before upload
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        //to accept file and store
        cb(null, true)
    } else {
        //to reject file and store
        cb(null, false)
    }
}

// const upload = multer({storage: storage});    //this will work, but no filtering
const upload = multer({
    storage: storage, limits: {   //this accepts filtering i.e 'limit to file size it accepts', additional filtering can be placed above this block like thatwe have above this block
        fileSize: 1024 * 1024 * 5       //.....means 5mb file limit
    }, fileFilter: fileFilter
});        //..............add the "fileFilter" property constant from above to the 




router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        productDescription: req.body.productDescription,
        productImage: req.file.path

    });
    product.save()
        .then(result => {
            console.log("Product created: " + result);
            res.status(201).json({
                message: "Product successfully created",
                createdProduct: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})


router.get('/', checkAuth, (req, res, next) => {
    Product.find()
        .select('_id productName productPrice productImage productDescription')
        .exec()
        .then(data => {
            console.log(data);
            const response = {
                count: data.length,
                products: data.map(doc => {
                    return {
                        productName: doc.productName,
                        _id: doc._id,
                        productPrice: doc.productPrice,
                        productImage: doc.productImage,
                        productDescription: doc.productDescription,
                        request: {
                            type: "GET",
                            url: "http://localhost:9000/products/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('_id productName productPrice productImage productDescription')
        .exec()
        .then(doc => {
            console.log("From database ", doc);
            if (doc) {
                res.status(200).json({
                    Product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:9000/products/"
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
            // res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });
})

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
        _id: id
    }, {
            $set: //{
                // name : req.body.newName,
                // price : req.body.newPrice
                //}
                updateOps  // this is a dynamic process that will change anything on the body, instead of the req.body.** aproach commented out above
        })
        .exec()
        .then(result => {
            console.log(result);
            if(!result.nModified == 1){
                res.status(404).json({
                    message: "Product was not updated!"
                })
            } else {
                res.status(200).json({
                    // result,
                    response: "Product Update was successful!",
                    message: 'Product Updates!!!',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:9000/products/' + id
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({
        _id: id
    })
        .exec()
        .then(result => {
            if(result.n == 0){
                res.status(401).json({
                    message: "Product does not exist in the database!"
                })
            }
            else if(!result.ok == 1){
                res.status(401).json({
                    message: "Unable to delete Product!"
                })
            } 
            else if(!result.ok == 1 && result.n == 0){
                res.status(401).json({
                    //#mybigmouth
                    message: "Yeepa! Wahala ti shele niyen o!, World people is involved!, Get the help of a native doctor"
                })
            }
            else {
                res.status(200).json({
                    message: "Product deleted!",
                    // response: result
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

// router.delete('/', (req, res, next) => {
//     Product.deleteMany()
//         .exec()
//         .then(result => {
//             res.status(200).json(result);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// })


module.exports = router;