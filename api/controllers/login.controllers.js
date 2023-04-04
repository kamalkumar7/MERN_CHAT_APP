require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const User  = require('../models/User.js')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const bcryptSalt = bcrypt.genSaltSync(10);

const login = async(req,res)=>{

    const {username, password} = req.body;
    const foundUser = await User.findOne({username});
    if (foundUser) {
      const passOk = bcrypt.compareSync(password, foundUser.password);
      if (passOk) {
        jwt.sign({userId:foundUser._id,username}, jwtSecret, {}, (err, token) => {
          res.cookie('token', token, {sameSite:'none', secure:true}).json({
            id: foundUser._id,
          });
        });
      }
      else
      {
        res.status(401).json("wrong credentials")
      }
    }else
    {
        res.status(404).json("user not found");
    }
}
module.exports = login