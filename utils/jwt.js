const jwt = require('jsonwebtoken')

const signJwt = (payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn:'1h'
    })
}

const verifyToken =(req,res)=>{
    if(req.headers.authorization == null){
        return res.status(403)
    }
    let token = req.headers.authorization.split(' ')[1]
    let vendor = jwt.verify(token,process.env.JWT_SECRET)
    return vendor
}

module.exports = {
    signJwt,
    verifyToken
}