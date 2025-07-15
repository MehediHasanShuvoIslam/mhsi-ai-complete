'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // Mock user (replace with real auth later)
  const [user, setUser] = useState({ name: 'MHSI User', id: 'user-123' });

  // Chats state: array of chat objects
  const [chats, setChats] = useState([
    {
      _id: 'chat-1',
      name: 'New Chat',  // changed from title to name to be consistent with ChatLabel etc
      messages: [],
      createdAt: Date.now(),
    },
  ]);

  // Currently selected chat
  const [selectedChat, setSelectedChat] = useState(null);

  // Initialize selectedChat on mount or when chats change
  useEffect(() => {
    if (chats.length === 0) {
      setSelectedChat(null);
    } else {
      // If current selectedChat no longer exists, select the first chat
      const found = chats.find((c) => c._id === selectedChat?._id);
      setSelectedChat(found || chats[0]);
    }
  }, [chats]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
