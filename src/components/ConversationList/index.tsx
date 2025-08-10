import { useChat } from '../../contexts/ChatContext';
import { Conversation } from '../../types/customer-service';
import './style.css';

export default function ConversationList() {
  const { state, dispatch } = useChat();

  const handleSelectConversation = (conversationId: string) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
  };

  const getLastMessage = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage ? lastMessage.content : '暂无消息';
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(
      msg => msg.sender === 'customer' && msg.status !== 'read'
    ).length;
  };

  const sortedConversations = [...state.conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="conversation-list">
      <div className="conversation-list__header">
        <h2>对话列表</h2>
        <div className="conversation-stats">
          <span className="stat">
            等待: {state.conversations.filter(c => c.status === 'waiting').length}
          </span>
          <span className="stat">
            进行中: {state.conversations.filter(c => c.status === 'active').length}
          </span>
        </div>
      </div>

      <div className="conversation-list__filters">
        <button className="filter-btn active">全部</button>
        <button className="filter-btn">等待中</button>
        <button className="filter-btn">进行中</button>
        <button className="filter-btn">已解决</button>
      </div>

      <div className="conversation-list__items">
        {sortedConversations.map((conversation) => {
          const customer = state.customers.find(c => c.id === conversation.customerId);
          const unreadCount = getUnreadCount(conversation);
          
          return (
            <div
              key={conversation.id}
              className={`conversation-item ${
                state.activeConversation === conversation.id ? 'active' : ''
              }`}
              onClick={() => handleSelectConversation(conversation.id)}
            >
              <div className="conversation-item__avatar">
                {customer?.avatar ? (
                  <img src={customer.avatar} alt={customer.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {customer?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                {customer?.isOnline && <div className="online-indicator" />}
              </div>

              <div className="conversation-item__content">
                <div className="conversation-item__header">
                  <span className="customer-name">{customer?.name || '匿名用户'}</span>
                  <span className="conversation-time">
                    {formatLastMessageTime(conversation.updatedAt)}
                  </span>
                </div>

                <div className="conversation-item__preview">
                  <span className="last-message">{getLastMessage(conversation)}</span>
                  {unreadCount > 0 && (
                    <span className="unread-count">{unreadCount}</span>
                  )}
                </div>

                <div className="conversation-item__meta">
                  <span className={`priority ${conversation.priority}`}>
                    {conversation.priority === 'urgent' && '🔴'}
                    {conversation.priority === 'high' && '🟠'}
                    {conversation.priority === 'medium' && '🟡'}
                    {conversation.priority === 'low' && '🟢'}
                  </span>
                  <span className={`status ${conversation.status}`}>
                    {conversation.status === 'waiting' && '等待'}
                    {conversation.status === 'active' && '进行中'}
                    {conversation.status === 'resolved' && '已解决'}
                    {conversation.status === 'closed' && '已关闭'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}