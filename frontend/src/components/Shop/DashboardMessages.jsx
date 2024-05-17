import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Inbox = () => {
  const receiverId = localStorage.getItem('sellerid'); // Get receiver ID from localStorage
  const [chats, setChats] = useState([]);
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/allchats/${receiverId}`);
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [receiverId]);
  console.log(chats)

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      <div className="space-y-4">
        {chats.map((chat) => (
          <Link
            key={chat}
            to={`/sellerchat/${chat}`}
            className="block p-4 bg-white shadow-md rounded-lg hover:bg-gray-100 transition duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Chat with {chat}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400 hover:text-gray-600 transition duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
