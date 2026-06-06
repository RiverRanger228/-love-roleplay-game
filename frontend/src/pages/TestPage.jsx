import { useState, useEffect } from 'react';
import axios from 'axios';
import './TestPage.css';

function TestPage({ onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  // 加载测试题目
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/api/test/questions');
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (error) {
        console.error('加载题目失败:', error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // 选择答案
  const handleSelectAnswer = (label) => {
    const newAnswers = [...answers, label];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 提交答案
      submitAnswers(newAnswers);
    }
  };

  // 提交答案
  const submitAnswers = async (finalAnswers) => {
    try {
      const userId = generateUserId();
      const response = await axios.post('/api/test/submit', {
        answers: finalAnswers,
        userId
      });
      setResult({ ...response.data.result, userId });
      setShowResult(true);
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  // 生成用户ID
  const generateUserId = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // 开始聊天
  const handleStartChat = () => {
    if (result) {
      onComplete({
        userId: result.userId,
        personalityType: result.description
      });
    }
  };

  if (loading) {
    return (
      <div className="test-page loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="test-page result-page">
        <div className="result-card">
          <h2 className="result-title">测试结果</h2>
          <div className="result-type">
            <span className="type-emoji">{getTypeEmoji(result.finalType)}</span>
            <span className="type-name">{result.description.name}</span>
          </div>
          <p className="result-description">{result.description.description}</p>
          <div className="result-keywords">
            {result.description.keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">{keyword}</span>
            ))}
          </div>
          <div className="result-scores">
            <h3>各维度得分</h3>
            <div className="score-bar">
              <span>🌸 温柔</span>
              <div className="bar">
                <div className="fill" style={{ width: `${result.scores.gentle * 10}%` }}></div>
              </div>
              <span>{result.scores.gentle}</span>
            </div>
            <div className="score-bar">
              <span>☀️ 阳光</span>
              <div className="bar">
                <div className="fill" style={{ width: `${result.scores.sunny * 10}%` }}></div>
              </div>
              <span>{result.scores.sunny}</span>
            </div>
            <div className="score-bar">
              <span>💢 傲娇</span>
              <div className="bar">
                <div className="fill" style={{ width: `${result.scores.tsundere * 10}%` }}></div>
              </div>
              <span>{result.scores.tsundere}</span>
            </div>
            <div className="score-bar">
              <span>🎩 成熟</span>
              <div className="bar">
                <div className="fill" style={{ width: `${result.scores.mature * 10}%` }}></div>
              </div>
              <span>{result.scores.mature}</span>
            </div>
          </div>
          <button className="start-chat-btn" onClick={handleStartChat}>
            开始与理想型聊天
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="test-page">
      <div className="question-card">
        <div className="progress">
          <span className="progress-text">
            {currentQuestion + 1} / {questions.length}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h2 className="question-text">{question.question}</h2>

        <div className="options">
          {question.options.map((option) => (
            <button
              key={option.label}
              className="option-btn"
              onClick={() => handleSelectAnswer(option.label)}
            >
              <span className="option-label">{option.label}</span>
              <span className="option-text">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTypeEmoji(type) {
  const emojiMap = {
    gentle: '🌸',
    sunny: '☀️',
    tsundere: '💢',
    mature: '🎩',
    gentle_sunny: '🌸☀️',
    gentle_tsundere: '🌸💢',
    gentle_mature: '🌸🎩',
    sunny_tsundere: '☀️💢',
    sunny_mature: '☀️🎩',
    tsundere_mature: '💢🎩'
  };
  return emojiMap[type] || '❓';
}

export default TestPage;