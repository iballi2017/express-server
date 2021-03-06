//This is the authentication file to provide protection to information as needed

//Import the json web token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log(process.env.JWT_KEY);
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        // const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed!'
        });
    }
};