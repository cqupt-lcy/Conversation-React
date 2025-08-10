import { ChatProvider } from '../../contexts/ChatContext';
import ConversationList from '../ConversationList';
import ChatWindow from '../ChatWindow';
import AgentPanel from '../AgentPanel';
import { useCustomerService } from '../../hooks/useCustomerService';
import './style.css';

function CustomerServiceContent() {
  const { activeConversation } = useCustomerService();

  return (
    <div className="customer-service-platform">
      <ConversationList />
      <div className="chat-area">
        {activeConversation ? (
          <ChatWindow conversationId={activeConversation} />
        ) : (
          <div className="no-conversation-selected">
            <div className="empty-state">
              <h3>欢迎使用客服平台</h3>
              <p>从左侧选择一个对话开始服务客户</p>
            </div>
          </div>
        )}
      </div>
      <AgentPanel />
    </div>
  );
}

export default function CustomerServicePlatform() {
  return (
    <ChatProvider>
      <CustomerServiceContent />
    </ChatProvider>
  );
}