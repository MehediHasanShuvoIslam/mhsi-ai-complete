'use client';

import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from "@clerk/nextjs";


const PromptBox = ({ setIsLoading, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  const sendPrompt = async () => {
    const promptCopy = prompt.trim();
    if (!promptCopy) return;

    if (!user) return toast.error('Please login to send a message');
    if (isLoading) return toast.error('Please wait for the previous response');

    try {
      setIsLoading(true);
      setPrompt('');

      const userMessage = {
        role: 'user',
        content: promptCopy,
        timestamp: Date.now(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, userMessage] }
            : chat
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      const { data } = await axios.post('/api/chat/ai', {
        chatId: selectedChat._id,
        prompt: promptCopy,
      });

      if (data.success) {
        const aiMessage = data.data;
        const tokens = aiMessage.content.split(' ');
        let assistantMessage = {
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, assistantMessage] }
              : chat
          )
        );
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        for (let i = 0; i < tokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = tokens.slice(0, i + 1).join(' ');
            setSelectedChat((prev) => {
              const updatedMessages = [...prev.messages.slice(0, -1), assistantMessage];
              return { ...prev, messages: updatedMessages };
            });
          }, i * 45);
        }
      } else {
        toast.error(data.message || 'AI response failed');
        setPrompt(promptCopy);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
      setPrompt(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="
          fixed bottom-0 left-0 right-0 bg-[#1f1f23]
          border-t border-gray-700 shadow-lg
          px-6 py-4 z-50
          flex flex-col
          max-w-full sm:max-w-[720px] mx-auto
        "
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendPrompt();
          }}
          className="flex items-center gap-4 w-full"
        >
          <textarea
            value={prompt}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPrompt(e.target.value)}
            className="
              flex-1
              min-h-[44px]
              max-h-[120px]
              resize-none
              rounded-xl
              bg-[#2c2c33]
              px-5 py-3
              text-white
              placeholder-gray-400
              outline-none
              text-base sm:text-lg
              scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
              transition
              focus:ring-2 focus:ring-primary
            "
            rows={1}
            placeholder="Message MHSI AI..."
            required
          />

          {/* Left badges - hidden on small */}
          <div className="hidden sm:flex flex-col gap-2 text-xs text-gray-400 select-none whitespace-nowrap">
            <div className="flex items-center gap-1 border border-gray-600 rounded-full px-3 py-1 hover:bg-gray-700 cursor-default transition">
              <Image className="h-4 w-4" src={assets.deepthink_icon} alt="DeepThink icon" />
              DeepThink (MHSI1)
            </div>
            <div className="flex items-center gap-1 border border-gray-600 rounded-full px-3 py-1 hover:bg-gray-700 cursor-default transition">
              <Image className="h-4 w-4" src={assets.search_icon} alt="Search icon" />
              Search With MHSI
            </div>
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`
              rounded-full p-3 flex items-center justify-center
              transition
              ${prompt.trim() && !isLoading
                ? 'bg-primary hover:bg-primary-dark cursor-pointer shadow-lg'
                : 'bg-gray-600 cursor-not-allowed'}
            `}
            aria-label="Send message"
          >
            <Image
              className="w-5 h-5"
              src={prompt.trim() && !isLoading ? assets.arrow_icon : assets.arrow_icon_dull}
              alt="Send icon"
            />
          </button>
        </form>

        {/* Disclaimer */}
        <p className="mt-3 text-center text-xs text-gray-500 select-none max-w-full sm:max-w-[720px] mx-auto">
          <em>MHSI AI may make mistakes. AI-generated content is for reference only.</em>
        </p>
      </div>

      {/* Bottom padding so content isn't hidden behind fixed prompt */}
      <div className="h-[92px] sm:h-[80px]" />
    </>
  );
};

export default PromptBox;
