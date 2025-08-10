import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Message } from '../../types/customer-service';
import MessageBubble from '../MessageBubble';
import MessageInput from '../MessageInput';
import './style.css';

interface ChatWindowProps {
  conversationId: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const { state, dispatch } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversation = state.conversations.find(conv => conv.id === conversationId);
  const customer = state.customers.find(c => c.id === conversation?.customerId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversation?.messages]);

  const handleSendMessage = (content: string) => {
    if (!conversation || !state.currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: 'agent',
      type: 'text',
      status: 'sent',
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { conversationId, message: newMessage },
    });
  };

  if (!conversation) {
    return (
      <div className="chat-window chat-window--empty">
        <div className="chat-window__empty-state">
          <h3>选择一个对话开始聊天</h3>
          <p>从左侧对话列表中选择一个对话</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__customer-info">
          <div className="customer-avatar">
            {customer?.avatar ? (
              <img src={customer.avatar} alt={customer.name} />
            ) : (
              <div className="avatar-placeholder">
                {customer?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="customer-details">
            <h3>{customer?.name}</h3>
            <span className={`status ${customer?.isOnline ? 'online' : 'offline'}`}>
              {customer?.isOnline ? '在线' : '离线'}
            </span>
          </div>
        </div>
        <div className="chat-window__actions">
          <button className="btn-icon" title="更多选项">
            ⚙️
          </button>
        </div>
      </div>

      <div className="chat-window__messages">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}