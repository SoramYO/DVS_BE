const admin = require('firebase-admin');
const db = admin.database();

const initializeChat = () => {
    const chatsRef = db.ref('chats');
    const activeChatsRef = db.ref('activeChats');

    return {
        initiateChat: (user) => {
            const newChatRef = chatsRef.push();
            const chatId = newChatRef.key;
            newChatRef.set({
                customerName: `${user.firstName} ${user.lastName}`,
                messages: [{ sender: 'System', message: 'Chat initiated' }]
            });
            activeChatsRef.child(chatId).set(true);
            return chatId;
        },

        sendMessage: (chatId, message, sender) => {
            const chatRef = chatsRef.child(chatId);
            chatRef.child('messages').push({ sender, message });
        },

        closeChat: (chatId, closedBy) => {
            const chatRef = chatsRef.child(chatId);
            chatRef.child('messages').push({ sender: 'System', message: `Chat closed by ${closedBy}` });
            activeChatsRef.child(chatId).remove();
        },

        listenToActiveChats: (callback) => {
            activeChatsRef.on('value', (snapshot) => {
                const activeChats = snapshot.val();
                callback(activeChats);
            });
        },

        listenToChat: (chatId, callback) => {
            const chatRef = chatsRef.child(chatId);
            chatRef.on('value', (snapshot) => {
                const chat = snapshot.val();
                callback(chat);
            });
        }
    };
};

module.exports = initializeChat;