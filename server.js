const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config()
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'upload')))
app.use('/upload', express.static(__dirname + '/upload/'));

mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log("database connected");
    })
    .catch(() => {
        console.log("error connected");
    }) 
 
const port = process.env.PORT
app.listen(port, () => {
    console.log(`connected at ${port}`);
})

app.use('/user',require('./routers/user.router'))
app.use('/role',require('./routers/role.router'))