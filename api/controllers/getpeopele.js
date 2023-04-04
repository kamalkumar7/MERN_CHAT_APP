const User = require('../models/User.js')
const getpeople = async(req,res)=>{
 
    const users = await User.find({}, {'_id':1,username:1});
    res.json(users);
}
module.exports = getpeople;