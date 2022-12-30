const connectToMongoose = require("./db");
const express = require('express');
var cors = require('cors')




connectToMongoose();
const app = express()
const port = 5000;


app.use(cors())
app.use(express.json());
//Avaiable routes

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})