const jwt = require("jsonwebtoken");
const User = require('../models/users.js');

const config = process.env;

const verifyToken = (req, res, next) => {

  try{
    const token = req.header('Authorization');
    const user = jwt.verify(token, 'key');
    User.findByPk(user.userId).then(user=>{
      console.log(user);
      req.user = user;
      next();
    })
    
  }catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  
  
};

module.exports = {
  verifyToken,
}
