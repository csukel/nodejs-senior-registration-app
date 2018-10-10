const express = require('express');
const bodyParser = require('body-parser');
const routeUsers = require('./routes/users');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use('/user',routeUsers);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})