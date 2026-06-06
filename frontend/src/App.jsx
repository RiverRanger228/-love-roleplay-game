import { useState } from 'react';
import TestPage from './pages/TestPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [page, setPage] = useState('test');
  const [userData, setUserData] = useState(null);

  const handleTestComplete = (data) => {
    setUserData(data);
    setPage('chat');
  };

  return (
    <div className="app">
      {page === 'test' ? (
        <TestPage onComplete={handleTestComplete} />
      ) : (
        <ChatPage userData={userData} onRestart={() => setPage('test')} />
      )}
    </div>
  );
}

export default App;