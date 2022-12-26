const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcriptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');



const JWT_Sercet = "ZGMF";
const router = express.Router();


//create a user using post "/api/auth/"


router.post('/createUser',[
  body('email').isEmail(),
  body('name').isLength({ min: 3 }),
  body('password').isLength({ min: 5 }),

],async(req,res)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
try {

  console.log("enter in try");
  let user =await User.findOne({email:req.body.email});
  if(user){
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
  const jwtData = jwt.sign(user.toJSON(),JWT_Sercet)
  res.status(201).json({authToken:jwtData})
} catch (error) {
  console.log(error);
  res.status(500).send("Some Error")
}
})


//auth User Login
router.post('/login',[
  body('email').isEmail(),

],async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
 
  try {
    let user =await User.findOne({email:req.body.email});
    if(!user){
      res.status(400).json({error:'enter correct email'})
    }
    const comparepass = bcriptjs.compare(req.body.password,user.password);
    if(!comparepass){
      res.status(400).json({error:'enter correct email'})
    }
    const payload = {
      id:user.id
    }
    const jwtData = jwt.sign(user.toJSON(),JWT_Sercet)
    res.status(200).json({authToken:jwtData})
  } catch (error) {
    res.status(500).send("Some Error")
  }


})

module.exports = router