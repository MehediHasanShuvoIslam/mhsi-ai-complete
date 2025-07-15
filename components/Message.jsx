'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const Message = ({ role, content, typing = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  // Typing animation for assistant messages
  useEffect(() => {
    if (typing && role === 'assistant') {
      setDisplayedText('');
      indexRef.current = 0;

      intervalRef.current = setInterval(() => {
        setDisplayedText((prev) => {
          if (indexRef.current >= content.length) {
            clearInterval(intervalRef.current);
            return prev;
          }
          const next = prev + content.charAt(indexRef.current);
          indexRef.current += 1;
          return next;
        });
      }, 30);

      return () => clearInterval(intervalRef.current);
    } else {
      setDisplayedText(content);
      clearInterval(intervalRef.current);
    }
  }, [content, typing, role]);

  // Button handlers (can be expanded)
  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => alert('Copied to clipboard!'));
  };
  const handleEdit = () => alert('Edit functionality not implemented yet.');
  const handleRegenerate = () => alert('Regenerate functionality not implemented yet.');
  const handleLike = () => alert('Liked!');
  const handleDislike = () => alert('Disliked!');

  const isUser = role === 'user';

  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      <div className={`flex flex-col w-full mb-8 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`group relative flex max-w-2xl py-3 px-5 rounded-xl break-words whitespace-pre-wrap ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-700 text-gray-100 rounded-bl-none gap-3'
          }`}
        >
          {/* Action buttons */}
          <div
            className={`opacity-0 group-hover:opacity-100 absolute ${
              isUser ? '-left-16 top-2.5' : 'left-9 -bottom-6'
            } flex items-center gap-2 transition-all select-none`}
          >
            {isUser ? (
              <>
                <button onClick={handleCopy} aria-label="Copy user message">
                  <Image src={assets.copy_icon} alt="Copy" className="w-4 cursor-pointer" />
                </button>
                <button onClick={handleEdit} aria-label="Edit user message">
                  <Image src={assets.pencil_icon} alt="Edit" className="w-4 cursor-pointer" />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCopy} aria-label="Copy assistant message">
                  <Image src={assets.copy_icon} alt="Copy" className="w-5 cursor-pointer" />
                </button>
                <button onClick={handleRegenerate} aria-label="Regenerate assistant message">
                  <Image src={assets.regenerate_icon} alt="Regenerate" className="w-4 cursor-pointer" />
                </button>
                <button onClick={handleLike} aria-label="Like assistant message">
                  <Image src={assets.like_icon} alt="Like" className="w-4 cursor-pointer" />
                </button>
                <button onClick={handleDislike} aria-label="Dislike assistant message">
                  <Image src={assets.dislike_icon} alt="Dislike" className="w-4 cursor-pointer" />
                </button>
              </>
            )}
          </div>

          {/* Message content */}
          {isUser ? (
            <span className="text-white/90">{displayedText}</span>
          ) : (
            <>
              <Image
                src={assets.logo_icon}
                alt="AI"
                className="h-9 w-9 p-1 border border-white/15 rounded-full flex-shrink-0"
              />
              <div className="space-y-4 w-full">{displayedText}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
