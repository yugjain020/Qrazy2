'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useBusinessVertical } from '@/lib/contexts/BusinessVerticalContext';
import ChatMessage from '@/components/ai/ChatMessage';
import SuggestionChips from '@/components/ai/SuggestionChips';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { workspace, verticalConfig } = useBusinessVertical();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0 && workspace?.businessType) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! 👋 I'm your QRAZY AI Assistant, specialized in **${verticalConfig.arExperienceLabel}** for the **${workspace.businessType}** industry.\n\nI can help you with:\n• AR marketing strategies for your business\n• Best practices for 3D product presentation\n• QR code campaign ideas\n• Customer engagement tips\n• Analytics interpretation\n\nHow can I help you today?`,
        },
      ]);
    }
  }, [workspace?.businessType]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    
    const userMessage: Message = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Format messages for Groq API (only send last 10 for context window limits)
      const apiMessages = newMessages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          workspaceId: workspace?.workspaceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Remove the user message if API failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared! 🧹 I'm still here to help with your **${verticalConfig.arExperienceLabel}** needs. What would you like to know?`,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-500" />
            AI Assistant
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your {verticalConfig.arExperienceLabel} expert for {workspace?.businessType || 'business'}
          </p>
        </div>
        {messages.length > 1 && (
          <button
            onClick={clearChat}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto glass-card p-4 sm:p-6 mb-4 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {isLoading && (
          <ChatMessage role="assistant" content="" isTyping />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips (show only when chat is mostly empty) */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <SuggestionChips onSelect={(text) => sendMessage(text)} />
        </div>
      )}

      {/* Input Area */}
      <div className="glass-card p-3 flex items-end gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${verticalConfig.arExperienceLabel} strategies...`}
          rows={1}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none max-h-32"
          style={{ minHeight: '40px' }}
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-2">
        AI responses are generated by Llama 3.3 70B via Groq. Verify important information independently.
      </p>
    </div>
  );
}