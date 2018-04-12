const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '1gb', extended: false }));

require('./mongo');

var auth = require('./routes/auth')(express.Router(), Users)
app.use('/auth',auth);


var Port = 2000; // server port number
app.listen(Port, ()=>{
  console.log('Server Porting on ' + Port)
})
