
  require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
console.log(jwtSecret +"  hello")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bcryptSalt = bcrypt.genSaltSync(10);
const User = require('../models/User.js')

 const register = async (req,res)=>{
    
  const {username,password} = req.body;
  const founduser =  await User.findOne({username});
  if(founduser){res.status(403).json("user already exists")}
  
  else
  {
    try {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
      const createdUser = await User.create({
        username:username,
        password:hashedPassword,
      });
      jwt.sign({userId:createdUser._id,username}, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
          id: createdUser._id,
        });
      });
    } catch(err) {
      if (err) throw err;
      res.status(500).json('error');
    }
  }
}

module.exports = register