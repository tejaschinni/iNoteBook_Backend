const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcriptjs = require('bcryptjs');


const router = express.Router();


//create a user using post "/api/auth/"


router.post('/createUser',[
  body('email').isEmail(),
  body('name').isLength({ min: 3 }),
  body('password').isLength({ min: 5 }),

],async(req,res)=> {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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

  res.status(201).json(res.body)
});

module.exports = router