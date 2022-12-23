const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');


const router = express.Router();


//create a user using post "/api/auth/"


router.post('/',(req,res)=> {
  console.log(req.body);
  const user = User(req.body)
  user.save();
    res.json(req.body)
});

module.exports = router