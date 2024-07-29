const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
// const http = require('http');
// const socketIo = require('socket.io');


const app = express();
app.use(cors());
app.use(bodyParser.json());

const loginRoute = require('./routes/Login');
const signupRoute = require('./routes/SignUp');

app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});