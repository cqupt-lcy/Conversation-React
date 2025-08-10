import { useState, KeyboardEvent } from 'react';
import './style.css';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <div className="message-input__toolbar">
        <button className="btn-icon" title="表情">
          😊
        </button>
        <button className="btn-icon" title="附件">
          📎
        </button>
      </div>
      <div className="message-input__main">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          disabled={disabled}
          rows={1}
          className="message-textarea"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="send-button"
          title="发送"
        >
          ➤
        </button>
      </div>
    </div>
  );
}