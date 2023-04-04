  const logout = async(req,res)=>{
    res.cookie('token', '', {sameSite:'none', secure:true}).json('ok');
}

module.exports  = logout