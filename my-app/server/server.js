const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allows requests from any origin. Adjust this for more security.
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Anu1',
    database: 'code_editor'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// API endpoint to save code
app.post('/save', (req, res) => {
    const { content } = req.body;
    const query = 'INSERT INTO code_snippets (content) VALUES (?)';
    db.query(query, [content], (err, result) => {
        if (err) throw err;
        res.send('Code saved successfully!');
    });
});

// API endpoint to get code
app.get('/code/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT content FROM code_snippets WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) throw err;
        res.send(results[0]);
    });
});

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('codeChange', (code) => {
        socket.broadcast.emit('codeUpdate', code);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = 5000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
