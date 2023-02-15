const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcriptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser')


const JWT_Sercet = "ZGMF";
const router = express.Router();


//create a user using post "/api/auth/"


router.post('/createUser',[
  body('email').isEmail(),
  body('name').isLength({ min: 3 }),
  body('password').isLength({ min: 5 }),

],async(req,res)=> {
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
try {

  console.log("enter in try");
  let user =await User.findOne({email:req.body.email});
  if(user){
    success= false;
    return res.status(400).json({error: 'User already Exits'})
  }
  const salt = await bcriptjs.genSalt(10);
  const secPassword = await bcriptjs.hash(req.body.password,salt);
  user = await  User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPassword,
  })
  const data = {
    id:user.id
  }
  const jwtData = jwt.sign(data,JWT_Sercet)
  success = true;
  res.status(201).json({success,jwtData})
} catch (error) {
  console.log(error);
  res.status(500).json({error:"Some Error"})
}
})


//auth User Login
router.post('/login',[
],async(req,res)=>{
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
 
  try {
    let user =await User.findOne({email:req.body.email});
    if(!user){
      res.status(400).json({error:'enter correct email'})
    }
    const comparepass =await bcriptjs.compare(req.body.password,user.password);
    if(!comparepass){
      success = false;
      res.status(400).json({error:'enter correct email'})
    }
    const payload = {
      id:user.id
    }
    const jwtData = jwt.sign(payload,JWT_Sercet)
    success = true;
    res.status(200).json({success,jwtData})
  } catch (error) {
  }

})

//get userdetails
router.post('/getuser', fetchUser ,async(req,res)=>{
  try {
    userID = req.userID;
    const user = await User.findById(userID).select('-password');
    res.status(200).send(user)
  } catch (error) {
    console.log(error);
    res.status(400).send({err:error})

  }
})

module.exports = router