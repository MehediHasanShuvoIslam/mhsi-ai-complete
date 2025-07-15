'use client';

import { assets } from '@/assets/assets';
import Image from 'next/image';
import React from 'react';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { useAppContext } from '@/context/AppContext';
import ChatLabel from './ChatLabel';

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn /*, openSignUp*/ } = useClerk();
  const { user } = useUser(); // get user from Clerk
  const { chats, setChats, setSelectedChat } = useAppContext();

  const createNewChat = () => {
    const newChat = {
      _id: Date.now().toString(),
      name: 'New Chat',
      messages: [],
    };
    setChats([newChat, ...chats]);
    setSelectedChat(newChat);
  };

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 z-50 h-screen transition-all duration-300 bg-[#212327] border-r border-white/10 overflow-hidden flex flex-col justify-between ${
        expand ? 'w-64 p-4' : 'w-16 items-center pt-4'
      }`}
    >
      {/* Top logo & toggle */}
      <div className="w-full">
        <div className={`flex ${expand ? 'items-center gap-4' : 'flex-col items-center gap-2'}`}>
          <Image
            className={`${expand ? 'w-36' : 'w-10'}`}
            src={expand ? assets.logo_text : assets.logo_icon}
            alt="logo"
          />
          <div
            onClick={() => setExpand(!expand)}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 h-9 w-9 rounded-lg cursor-pointer"
          >
            <Image
              src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
              alt="menu"
              className="w-6"
            />
            <div className="absolute top-12 w-max bg-black text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
              {expand ? 'Collapse' : 'Expand'}
            </div>
          </div>
        </div>

        {/* New Chat button */}
        <button
          onClick={createNewChat}
          className={`mt-6 group relative w-full flex items-center justify-center gap-2 ${
            expand ? 'bg-primary hover:opacity-90 text-white rounded-2xl py-2.5 px-4 font-medium' : ''
          }`}
        >
          <Image
            className={`${expand ? 'w-5' : 'w-6'}`}
            src={expand ? assets.chat_icon : assets.chat_icon_dull}
            alt="chat"
          />
          {expand && <span>New Chat</span>}
          {!expand && (
            <div className="absolute left-14 bg-black text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
              New Chat
            </div>
          )}
        </button>

        {/* Chat List */}
        <div className={`mt-8 text-white/40 text-sm ${expand ? '' : 'text-center'}`}>
          {expand && <p className="mb-2 px-2">Recents</p>}
          <ChatLabel chats={chats} setChats={setChats} setSelectedChat={setSelectedChat} expand={expand} />
        </div>
      </div>

      {/* Bottom section */}
      <div className="pb-4 flex flex-col gap-4 w-full">
        {/* QR code and contact id */}
        <div
          className={`group relative cursor-pointer text-white/80 hover:bg-white/10 transition rounded-lg p-2 ${
            expand ? 'flex items-center gap-2 px-3' : 'flex justify-center'
          }`}
        >
          <Image
            className="w-6"
            src={expand ? assets.phone_icon : assets.phone_icon_dull}
            alt="QR"
          />
          {expand && (
            <>
              <span>Get Contact ID</span>
              <Image src={assets.new_icon} alt="new" className="w-4" />
            </>
          )}
          <div className="absolute bottom-12 left-0 bg-black text-white text-sm p-3 rounded shadow-xl z-50 hidden group-hover:block">
            <Image src={assets.qrcode} alt="QR" className="w-40" />
            <div className="text-center mt-1">Scan to Connect</div>
          </div>
        </div>

        {/* User sign-in / profile */}
        <div
          className={`cursor-pointer group relative text-white/80 hover:bg-white/10 transition rounded-lg p-2 ${
            expand ? 'flex items-center gap-2 px-3' : 'flex justify-center'
          }`}
          onClick={() => {
            if (!user) openSignIn();
          }}
        >
          {user ? (
            <UserButton />
          ) : (
            <>
              <Image src={assets.profile_icon} alt="profile" className="w-7" />
              {expand && <span>Sign In</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
