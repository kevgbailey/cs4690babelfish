import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import Controls from './Controls';
import { useSpeech } from '../hooks/useSpeech';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const ChatPanel = ({ messages, sendMessage, user }) => {
    const [messageInput, setMessageInput] = useState('');
    const { isRecording, startRecording, stopRecording } = useSpeech(user?.language);
    const { speak } = useTextToSpeech(user?.language);

    const handleSend = () => {
        if (messageInput.trim()) {
            sendMessage(messageInput.trim());
            setMessageInput('');
        }
    };

    const handleRecordStart = () => {
        startRecording((transcript) => {
            setMessageInput(transcript);
        });
    };

    // Speak incoming messages that are not our own
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (!lastMessage.isOwn) {
                speak(lastMessage.text, { lang: user?.language });
            }
        }
    }, [messages, speak, user?.language]);

    return (
        <div id="chat-panel" className="panel">
            <MessageList messages={messages} />
            <Controls
                onSend={handleSend}
                onRecordStart={handleRecordStart}
                onRecordStop={stopRecording}
                isRecording={isRecording}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                language={user?.language}
            />
        </div>
    );
};

export default ChatPanel;
