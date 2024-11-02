require('dotenv').config();
const express = require('express')

const app = express();

app.listen(process.env.PORT || 5000,()=>{
    console.log("Server started on port " + 5000 + ", waiting for requests. . .");
})

