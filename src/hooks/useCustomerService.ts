import { useCallback, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Conversation, Message, Agent, Customer } from '../types/customer-service';

export function useCustomerService() {
  const { state, dispatch } = useChat();

  const initializeMockData = useCallback(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: '张三',
        email: 'zhang@example.com',
        isOnline: true,
        lastActiveAt: new Date(),
      },
      {
        id: '2',
        name: '李四',
        email: 'li@example.com',
        isOnline: false,
        lastActiveAt: new Date(Date.now() - 3600000),
      },
      {
        id: '3',
        name: '王五',
        email: 'wang@example.com',
        isOnline: true,
        lastActiveAt: new Date(),
      },
    ];

    const mockAgents: Agent[] = [
      {
        id: 'agent1',
        name: '客服小王',
        email: 'xiaowang@company.com',
        status: 'online',
        maxChats: 5,
        currentChats: 2,
      },
      {
        id: 'agent2',
        name: '客服小李',
        email: 'xiaoli@company.com',
        status: 'away',
        maxChats: 5,
        currentChats: 1,
      },
    ];

    const mockConversations: Conversation[] = [
      {
        id: 'conv1',
        customerId: '1',
        agentId: 'agent1',
        messages: [
          {
            id: 'msg1',
            content: '你好，我想咨询一下产品信息',
            timestamp: new Date(Date.now() - 600000),
            sender: 'customer',
            type: 'text',
            status: 'read',
          },
          {
            id: 'msg2',
            content: '您好！很高兴为您服务，请问您想了解哪方面的产品信息？',
            timestamp: new Date(Date.now() - 580000),
            sender: 'agent',
            type: 'text',
            status: 'read',
          },
          {
            id: 'msg3',
            content: '我想了解价格和功能',
            timestamp: new Date(Date.now() - 300000),
            sender: 'customer',
            type: 'text',
            status: 'delivered',
          },
        ],
        status: 'active',
        priority: 'medium',
        createdAt: new Date(Date.now() - 600000),
        updatedAt: new Date(Date.now() - 300000),
        tags: ['产品咨询'],
      },
      {
        id: 'conv2',
        customerId: '2',
        messages: [
          {
            id: 'msg4',
            content: '我的订单什么时候能到？',
            timestamp: new Date(Date.now() - 1800000),
            sender: 'customer',
            type: 'text',
            status: 'read',
          },
        ],
        status: 'waiting',
        priority: 'high',
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1800000),
        tags: ['订单查询'],
      },
      {
        id: 'conv3',
        customerId: '3',
        messages: [
          {
            id: 'msg5',
            content: '系统登录不上去',
            timestamp: new Date(Date.now() - 120000),
            sender: 'customer',
            type: 'text',
            status: 'sent',
          },
        ],
        status: 'waiting',
        priority: 'urgent',
        createdAt: new Date(Date.now() - 120000),
        updatedAt: new Date(Date.now() - 120000),
        tags: ['技术支持'],
      },
    ];

    dispatch({ type: 'SET_CONVERSATIONS', payload: mockConversations });
    dispatch({ type: 'SET_CURRENT_USER', payload: mockAgents[0] });

    state.customers = mockCustomers;
    state.agents = mockAgents;
  }, [dispatch, state]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (!conversation || !state.currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
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

    setTimeout(() => {
      const updatedMessage = { ...newMessage, status: 'delivered' as const };
      dispatch({
        type: 'UPDATE_CONVERSATION',
        payload: {
          ...conversation,
          messages: conversation.messages.map(msg =>
            msg.id === newMessage.id ? updatedMessage : msg
          ),
          updatedAt: new Date(),
        },
      });
    }, 1000);
  }, [state.conversations, state.currentUser, dispatch]);

  const assignConversation = useCallback((conversationId: string, agentId: string) => {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const updatedConversation: Conversation = {
      ...conversation,
      agentId,
      status: 'active',
      updatedAt: new Date(),
    };

    dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
  }, [state.conversations, dispatch]);

  const closeConversation = useCallback((conversationId: string) => {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const updatedConversation: Conversation = {
      ...conversation,
      status: 'resolved',
      updatedAt: new Date(),
    };

    dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
  }, [state.conversations, dispatch]);

  const simulateCustomerMessage = useCallback(() => {
    const activeConversations = state.conversations.filter(c => c.status === 'active');
    if (activeConversations.length === 0) return;

    const randomConv = activeConversations[Math.floor(Math.random() * activeConversations.length)];
    const customerMessages = [
      '好的，谢谢',
      '我明白了',
      '还有其他问题吗？',
      '价格能便宜一些吗？',
      '什么时候有促销活动？',
      '可以详细说明一下吗？',
    ];

    const randomMessage = customerMessages[Math.floor(Math.random() * customerMessages.length)];
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      content: randomMessage,
      timestamp: new Date(),
      sender: 'customer',
      type: 'text',
      status: 'sent',
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { conversationId: randomConv.id, message: newMessage },
    });
  }, [state.conversations, dispatch]);

  useEffect(() => {
    if (state.conversations.length === 0) {
      initializeMockData();
    }
  }, [initializeMockData, state.conversations.length]);

  useEffect(() => {
    const interval = setInterval(simulateCustomerMessage, 15000);
    return () => clearInterval(interval);
  }, [simulateCustomerMessage]);

  return {
    conversations: state.conversations,
    activeConversation: state.activeConversation,
    currentUser: state.currentUser,
    customers: state.customers,
    agents: state.agents,
    sendMessage,
    assignConversation,
    closeConversation,
  };
}