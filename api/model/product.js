//To define how the product should look like in the application

//Import mongoose
const mongoose = require('mongoose');

//create the schema
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productName : { type: String, required: true},
    productPrice : { type: Number, required: true},
    productDescription : { type: String, required: true},
    productImage : { type: String, required: true}
});

//export the schema
module.exports = Product = mongoose.model('Product', productSchema); //this will be imported in the routing folder i.e routes/products.js