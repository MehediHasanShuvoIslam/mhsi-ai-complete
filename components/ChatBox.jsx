'use client';

import React, { useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import Message from './Message';

const ChatBox = () => {
  const { selectedChat, isStreaming } = useAppContext();
  const bottomRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  if (!selectedChat) {
    return (
      <div className="flex flex-grow justify-center items-center text-gray-400 px-4 text-base sm:text-lg select-none">
        Select or start a chat to message <span className="text-white font-semibold">MHSI AI</span>.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-2 md:px-6 pb-4 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {selectedChat.messages.map((msg, idx) => (
        <Message
          key={idx}
          role={msg.role}
          content={msg.content}
          typing={isStreaming && idx === selectedChat.messages.length - 1 && msg.role === 'assistant'}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBox;
