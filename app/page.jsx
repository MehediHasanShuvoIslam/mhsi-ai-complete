'use client';

import React, { useState, useEffect } from 'react';
import ChatBox from '@/components/ChatBox';
import PromptBox from '@/components/PromptBox';
import Sidebar from '@/components/Sidebar';
import { AppContextProvider, useAppContext } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const MainContent = ({ isLoading, setIsLoading }) => {
  const { selectedChat } = useAppContext();
  const hasMessages = selectedChat?.messages?.length > 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-between relative pb-6 pt-6 px-4">
      <Toaster position="top-center" />

      {/* Logo + Intro Text (only if no messages) */}
      {!hasMessages && (
        <div className="flex flex-col items-center justify-center mb-6">
          <Image
            src={assets.logo_icon}
            alt="MHSI AI Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 mb-2"
          />
          <h1 className="text-3xl font-bold text-white mb-1">I'm MHSI AI</h1>
          <p className="text-base sm:text-lg text-blue-400">MHSI AI from Bangladesh</p>
        </div>
      )}

      {/* Chat Box (will show messages or stay empty) */}
      <div className="flex-1 w-full max-w-4xl flex flex-col">
        <ChatBox />
      </div>

      {/* Prompt Box */}
      <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />

      {/* Footer note */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        MHSI AI can make mistakes. AI-generated content is for reference only.
      </p>
    </div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [expand, setExpand] = useState(true); // Sidebar expanded by default

  return (
    <AppContextProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-[#1f1f23] via-[#1d1f25] to-[#141518] text-white">
        <Sidebar expand={expand} setExpand={setExpand} />
        <MainContent isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>
    </AppContextProvider>
  );
}
