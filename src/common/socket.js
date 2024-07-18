module.exports = function (io) {
    var users = [];
    let activeChats = new Map();
    let staff = new Set();

    io.on('connection', (socket) => {


        socket.on('initiate_chat', (user) => {
            socket.user = user;
            const chatId = socket.id;
            if (!user) {
                user = { firstName: 'guest', lastName: '' };
            }
            if (!activeChats.has(chatId)) {
                activeChats.set(chatId, {
                    customerName: `${user.firstName} ${user.lastName}`,
                    messages: []
                });
                socket.join(chatId);
                socket.emit('chat_initiated', { chatId, message: 'You have joined the chat room' });
                io.to('staffRoom').emit('new_chat_request', { chatId, customerName: `${user.firstName} ${user.lastName}` });
            }
        });

        socket.on('join_staff_room', (staffUser) => {
            if (!staff.has(staffUser.id)) {
                staff.add(staffUser.id);
                socket.join('staffRoom');
                socket.emit('active_chats', Array.from(activeChats.entries()).map(([id, data]) => ({
                    chatId: id,
                    customerName: data.customerName,
                    messageCount: data.messages.length
                })));
            }
        });

        socket.on('staff_join', ({ staffData, chatId }) => {
            if (activeChats.has(chatId)) {
                socket.join(chatId);
                const chatData = activeChats.get(chatId);
                io.to(chatId).emit('staff_joined', { message: `${staffData.firstName} has joined the chat` });
                // Send chat history to staff
                socket.emit('chat_history', { chatId, messages: chatData.messages });
            }
        });

        socket.on('chat_message', (data) => {
            const { chatId, message, sender } = data;
            if (activeChats.has(chatId)) {
                const chatData = activeChats.get(chatId);
                chatData.messages.push({ sender, message });
                io.to(chatId).emit('chat_message', { sender, message });
                // Update message count for staff
                io.to('staffRoom').emit('update_message_count', { chatId, count: chatData.messages.length });
            }
        });

        socket.on('close_chat', ({ chatId, closedBy }) => {
            if (activeChats.has(chatId)) {
                const chatData = activeChats.get(chatId);
                const closeMessage = `Chat closed by ${closedBy}`;
                chatData.messages.push({ sender: 'System', message: closeMessage });
                io.to(chatId).emit('chat_closed', { message: closeMessage });
                io.to('staffRoom').emit('chat_closed', { chatId, message: closeMessage });
                activeChats.delete(chatId);
            }
        });

        socket.on('disconnect', () => {
            if (socket.user) {
                const chatId = socket.id;
                if (activeChats.has(chatId)) {
                    const closeMessage = `${socket.user.firstName} ${socket.user.lastName} has disconnected from the chat room`;
                    io.to('staffRoom').emit('chat_closed', { chatId, message: closeMessage });
                    activeChats.delete(chatId);
                }
            }
            if (staff.has(socket.id)) {
                staff.delete(socket.id);
            }
        });
    });
};