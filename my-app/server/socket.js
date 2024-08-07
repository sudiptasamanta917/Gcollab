module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinRoom', (groupId) => {
            socket.join(groupId);
            console.log(`Client joined room ${groupId}`);
        });

        socket.on('leaveRoom', (groupId) => {
            socket.leave(groupId);
            console.log(`Client left room ${groupId}`);
        });

        socket.on('codeChange', ({ groupId, code }) => {
            socket.to(groupId).emit('codeUpdate', code);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};
