const Message = require('../models/Message.js')
const User = require('../models/User.js')
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
      const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  } else {
    reject('no token');
  }
});

}
const getMessage = async(req,res)=>{
    const {userId} = req.params;

  try {
    const userData = await  getUserDataFromRequest(req);
        
    const ourUserId = userData.userId;
    const messages = await Message.find({
      sender:{$in:[userId,ourUserId]},
      recipient:{$in:[userId,ourUserId]},
    }).sort({createdAt: 1});
    res.json(messages);
    } 
    catch (error) {
        console.log(error);
    } 
        
        

}

module.exports = getMessage;