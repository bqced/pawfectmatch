import firestore from '@react-native-firebase/firestore';
import { NotificationService } from './NotificationService';

export class ChatService {
  static getChatsCollection() {
    return firestore().collection('chats');
  }

  static getMessagesCollection() {
    return firestore().collection('messages');
  }

  static async createChat(user1Id, user2Id) {
    const chatRef = this.getChatsCollection().doc();
    
    await chatRef.set({
      participants: [user1Id, user2Id],
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastMessage: null,
      lastMessageTimestamp: null,
    });

    return chatRef.id;
  }

  static async sendMessage(chatId, senderId, message) {
    const messageRef = this.getMessagesCollection().doc();
    const chatRef = this.getChatsCollection().doc(chatId);

    const messageData = {
      chatId,
      senderId,
      text: message,
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
    };

    await messageRef.set(messageData);

    // Update the chat with last message
    await chatRef.update({
      lastMessage: message,
      lastMessageTimestamp: firestore.FieldValue.serverTimestamp(),
    });

    // Get recipient and send notification
    const chat = await chatRef.get();
    const recipientId = chat.data().participants.find(id => id !== senderId);
    
    // Fetch sender's name for notification
    const sender = await firestore().collection('users').doc(senderId).get();
    const senderName = sender.data().petName;

    await NotificationService.scheduleMessageNotification(senderName, message);

    return messageRef.id;
  }

  static subscribeToChat(chatId, callback) {
    return this.getMessagesCollection()
      .where('chatId', '==', chatId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const messages = [];
        snapshot.forEach(doc => {
          messages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(messages);
      });
  }

  static async markMessageAsRead(messageId) {
    await this.getMessagesCollection().doc(messageId).update({
      read: true,
    });
  }

  static getUserChats(userId) {
    return this.getChatsCollection()
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageTimestamp', 'desc')
      .onSnapshot(async snapshot => {
        const chats = [];
        for (const doc of snapshot.docs) {
          const chatData = doc.data();
          const otherUserId = chatData.participants.find(id => id !== userId);
          
          // Get other user's details
          const otherUser = await firestore()
            .collection('users')
            .doc(otherUserId)
            .get();

          chats.push({
            id: doc.id,
            ...chatData,
            otherUser: otherUser.data(),
          });
        }
        return chats;
      });
  }

  static async deleteChat(chatId) {
    const batch = firestore().batch();
    
    // Delete all messages in the chat
    const messages = await this.getMessagesCollection()
      .where('chatId', '==', chatId)
      .get();
    
    messages.forEach(message => {
      batch.delete(message.ref);
    });

    // Delete the chat document
    batch.delete(this.getChatsCollection().doc(chatId));

    await batch.commit();
  }
} 