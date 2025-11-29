import React from 'react';
import SetupPanel from './components/SetupPanel';
import ChatPanel from './components/ChatPanel';
import { useChat } from './hooks/useChat';
import RecordingPanel from './components/RecordingPanel';

function App() {
  const {
    messages,
    connectionStatus,
    isConnected,
    connect,
    isRecording,
    record,
    sendMessage,
    user
  } = useChat();

  return (
    <div className="app-container">
      <header>
        <h1>Babel Fish</h1>
        <div
          id="connection-status"
          className={`status ${isConnected ? 'connected' : 'disconnected'}`}
        >
          {connectionStatus}
        </div>
      </header>

      <main>
        {!isConnected ? !isRecording ? (
          <SetupPanel onConnect={connect} onRecord={record} />
        ) : (
          <RecordingPanel
            user={user}
          />
        ) : (
          <ChatPanel
            messages={messages}
            sendMessage={sendMessage}
            user={user}
          />
        )}
      </main>
    </div>
  );
}

export default App;
