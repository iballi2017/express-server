const http = require('http');

//import app
const app = require('./app');


const connectDB = require('./connection')

connectDB();

const port = process.env.PORT || 9000;
const server = http.createServer(app);



server.listen(port);