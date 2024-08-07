const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const socketIo = require('socket.io');
const http = require('http');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: "*", // Adjust this for more security.
      methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(bodyParser.json());


const loginRoute = require('./routes/Login');
const signupRoute = require('./routes/SignUp');
const groupsRoute = require('./routes/Groups');
const codeEditorRoute = require('./routes/CodeEditor');
const socketSetup = require('./socket');

app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);
app.use('/api', groupsRoute);
app.use('/api', codeEditorRoute);

// Setup Socket.IO
socketSetup(io);

const port = 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
