export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'customer' | 'agent';
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastActiveAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  maxChats: number;
  currentChats: number;
}

export interface Conversation {
  id: string;
  customerId: string;
  agentId?: string;
  messages: Message[];
  status: 'waiting' | 'active' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface ChatState {
  conversations: Conversation[];
  activeConversation: string | null;
  agents: Agent[];
  customers: Customer[];
  currentUser: Agent | null;
}