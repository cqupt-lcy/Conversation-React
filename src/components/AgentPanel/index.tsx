import { useChat } from '../../contexts/ChatContext';
import './style.css';

export default function AgentPanel() {
  const { state, dispatch } = useChat();

  const handleStatusChange = (status: 'online' | 'away' | 'offline') => {
    if (state.currentUser) {
      dispatch({
        type: 'UPDATE_AGENT_STATUS',
        payload: { agentId: state.currentUser.id, status }
      });
    }
  };

  if (!state.currentUser) {
    return (
      <div className="agent-panel">
        <div className="agent-panel__login">
          <h3>请登录</h3>
          <p>请先登录客服系统</p>
        </div>
      </div>
    );
  }

  const { currentUser } = state;
  const activeChats = state.conversations.filter(
    conv => conv.agentId === currentUser.id && conv.status === 'active'
  ).length;

  const waitingChats = state.conversations.filter(
    conv => conv.status === 'waiting'
  ).length;

  return (
    <div className="agent-panel">
      <div className="agent-panel__profile">
        <div className="agent-avatar">
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} />
          ) : (
            <div className="avatar-placeholder">
              {currentUser.name[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="agent-info">
          <h3>{currentUser.name}</h3>
          <p>{currentUser.email}</p>
        </div>
      </div>

      <div className="agent-panel__status">
        <label>状态:</label>
        <div className="status-buttons">
          <button
            className={`status-btn ${currentUser.status === 'online' ? 'active' : ''}`}
            onClick={() => handleStatusChange('online')}
          >
            🟢 在线
          </button>
          <button
            className={`status-btn ${currentUser.status === 'away' ? 'active' : ''}`}
            onClick={() => handleStatusChange('away')}
          >
            🟡 离开
          </button>
          <button
            className={`status-btn ${currentUser.status === 'offline' ? 'active' : ''}`}
            onClick={() => handleStatusChange('offline')}
          >
            🔴 离线
          </button>
        </div>
      </div>

      <div className="agent-panel__stats">
        <div className="stat-card">
          <div className="stat-number">{activeChats}</div>
          <div className="stat-label">进行中对话</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{waitingChats}</div>
          <div className="stat-label">等待中对话</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{currentUser.maxChats - activeChats}</div>
          <div className="stat-label">可接受对话</div>
        </div>
      </div>

      <div className="agent-panel__actions">
        <button className="action-btn primary">
          接受等待对话
        </button>
        <button className="action-btn">
          查看历史记录
        </button>
        <button className="action-btn">
          设置
        </button>
      </div>

      <div className="agent-panel__team">
        <h4>团队成员</h4>
        <div className="team-list">
          {state.agents.map(agent => (
            <div key={agent.id} className="team-member">
              <div className="member-avatar">
                {agent.avatar ? (
                  <img src={agent.avatar} alt={agent.name} />
                ) : (
                  <div className="avatar-placeholder small">
                    {agent.name[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="member-info">
                <span className="member-name">{agent.name}</span>
                <span className={`member-status ${agent.status}`}>
                  {agent.status === 'online' && '🟢 在线'}
                  {agent.status === 'away' && '🟡 离开'}
                  {agent.status === 'offline' && '🔴 离线'}
                </span>
              </div>
              <div className="member-chats">
                {agent.currentChats}/{agent.maxChats}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}