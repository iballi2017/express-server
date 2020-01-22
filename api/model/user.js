//To define how the user should look like in the application

//Import mongoose
const mongoose = require('mongoose');

//create the schema
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    phone: {
        type: String, required: true,
        // match: "/^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/"
    },
    email: {
        type: String,
        required: true,
        unique: true,//"Unique" doesn't mean that the email will be perculiar only to a user
        //it only does field optimization. It won't even validate the email field values
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    //"match" does the validation
    password: { type: String, required: true }
});

//export the schema
module.exports = mongoose.model('User', userSchema); //this will be imported in the routing folder i.e routes/products.js