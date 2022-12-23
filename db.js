const mongoose = require('mongoose');
const mongooseUri = "mongodb+srv://tejasc:Admin%4012345@cluster0.x15vduz.mongodb.net/test";


const connectToMongoose = () =>{
    mongoose.set('strictQuery', false);
    console.log("mongo deb conte");
    mongoose.connect(mongooseUri,()=>{
        console.log("connect done");
    })
}

module.exports = connectToMongoose