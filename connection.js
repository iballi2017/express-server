const mongoose = require('mongoose');
require('dotenv').config();


// const URL = "mongodb+srv://ekomeals:ekomeals@iballidb-nxfdz.mongodb.net/simpleProducts?retryWrites=true&w=majority";
const URL = "mongodb+srv://ekomeals:" + process.env.MONGO_ATLAS_PWaa + "@iballidb-nxfdz.mongodb.net/simpleProducts?retryWrites=true&w=majority";
// const URL = "mongodb+srv://ekomeals:" + process.env.MONGO_ATLAS_PW + "@iballidb-nxfdz.mongodb.net/ekomeals?retryWrites=true&w=majority";

console.log(process.env.MONGO_ATLAS_PWaa)
console.log(process.env.JWT_KEY)   
//NOTE: HOW  I SOLVED THE ËNVIRONMENT VARIABLE ISSUE WITH "dotenv" dependency
// 1. Install dotenv "npm i dotenv"
// 2. Create a a file, and gave it a custom name that begins with ".", i.e any name of your choice
//          e.g ".env"
// 3. Create your variables and values
// e.g MONGO_ATLAS_PWaa = ekomeals
// e.g JWT_KEY = secret
// 4. Navigate to any file where you want to make use of the environment variables and import "dotenv"
//                require('dotenv').config();
// 5 Use your variables.
//             e.g   process.env.MONGO_ATLAS_PWaa
//             e.g   process.env.JWT_KEY
// 6. We do not need the nodemon.json type of procee.env again since it refused to work




const connectDB = async () => {
   await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
   console.log("DB Connected!")
}


module.exports = connectDB;