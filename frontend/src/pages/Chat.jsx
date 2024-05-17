import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const { id } = useParams(); // Extract 'id' from route params (receiver ID)
  const receiver = id;
  const sender = localStorage.getItem('userid'); // Get sender ID from localStorage

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/obtain/${sender}/${receiver}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:8000/messages', {
        sender,
        receiver,
        message: newMessage
      });
      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [receiver]); // Fetch messages whenever 'receiver' changes

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Chat with User ID: {receiver}</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 p-2 rounded-lg ${
              msg.sender === sender ? 'bg-blue-500 text-white self-end' : 'bg-gray-300'
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-l-lg"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
