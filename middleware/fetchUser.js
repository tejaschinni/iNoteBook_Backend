const jwt = require('jsonwebtoken');



const fetchUser =(req,res,next)=>{
    const JWT_Sercet = "ZGMF";
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:'invalid token'})
    }
  try {
    
    const data = jwt.verify(token,JWT_Sercet)
    req.userID = data['_id'];
    next();
  } catch (error) {
    res.status(401).send({err:'some error'})
  }
}

module.exports = fetchUser;