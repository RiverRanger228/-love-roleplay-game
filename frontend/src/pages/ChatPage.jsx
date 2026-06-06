import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatPage.css';

function ChatPage({ userData, onRestart }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState(null);
  const messagesEndRef = useRef(null);

  // 初始化聊天
  useEffect(() => {
    initChat();
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始化聊天
  const initChat = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/chat/init', {
        userId: userData.userId,
        personalityType: userData.personalityType
      });

      if (response.data.success) {
        setCharacter(response.data.profile);
        // 添加开场白
        setMessages([
          {
            role: 'assistant',
            content: response.data.profile.opening
          }
        ]);
      }
    } catch (error) {
      console.error('初始化聊天失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText('');

    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      setLoading(true);
      const response = await axios.post('/api/chat/send', {
        userId: userData.userId,
        message: userMessage
      });

      if (response.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 重新开始
  const handleRestart = () => {
    if (confirm('确定要重新开始吗？当前对话记录将丢失。')) {
      onRestart();
    }
  };

  return (
    <div className="chat-page">
      {/* 聊天头部 */}
      <div className="chat-header">
        <div className="chat-title">
          <span className="avatar">{character?.name?.[0] || '❤️'}</span>
          <div className="title-info">
            <h3>{character?.name || '理想对象'}</h3>
            <span className="status">在线</span>
          </div>
        </div>
        <button className="restart-btn" onClick={handleRestart}>重新测试</button>
      </div>

      {/* 聊天区域 */}
      <div className="chat-messages">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message assistant typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你想说的话..."
          disabled={loading}
          rows={1}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={loading || !inputText.trim()}
        >
          发送
        </button>
      </div>
    </div>
  );
}

export default ChatPage;