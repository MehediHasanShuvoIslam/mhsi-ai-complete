'use client';

import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const ChatLabel = ({ chats, selectedChat, setSelectedChat, setChats, expand }) => {
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (editId) {
      const chatToEdit = chats.find(c => c._id === editId);
      if (chatToEdit) {
        setEditValue(chatToEdit.name || '');
      }
    }
  }, [editId, chats]);

  const renameChat = (id, newName) => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setEditId(null);
      return;
    }

    setChats(chats.map(chat =>
      chat._id === id ? { ...chat, name: trimmed } : chat
    ));
    setEditId(null);
  };

  const deleteChat = (id) => {
    setChats(chats.filter(chat => chat._id !== id));
    if (selectedChat?._id === id) {
      setSelectedChat(null);
    }
  };

  const handleSelectChat = (chat) => {
    if (editId !== chat._id) {
      setSelectedChat(chat);
    }
  };

  return (
    <ul className="space-y-2">
      {chats.map(chat => (
        <li
          key={chat._id}
          className={`flex items-center ${expand ? 'justify-between' : 'justify-center'} text-white px-2 py-1 rounded hover:bg-white/10 cursor-pointer ${
            selectedChat?._id === chat._id ? 'bg-white/20' : ''
          }`}
          onClick={() => handleSelectChat(chat)}
        >
          {editId === chat._id ? (
            <input
              className="bg-transparent border-b w-full text-white"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => renameChat(chat._id, editValue)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  renameChat(chat._id, editValue);
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 truncate">{chat.name}</span>
          )}
          {expand && editId !== chat._id && (
            <div className="flex gap-1 ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditId(chat._id);
                }}
                className="text-xs text-yellow-400"
                aria-label="Rename chat"
              >
                ✎
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat._id);
                }}
                className="text-xs text-red-400"
                aria-label="Delete chat"
              >
                🗑
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ChatLabel;
