import React from 'react';

const Controls = ({
    onSend,
    onRecordStart,
    onRecordStop,
    isRecording,
    messageInput,
    setMessageInput,
    language
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onSend();
    };

    const translations = {
        'es-ES': {
            'send': 'Enviar',
            'placeholder': 'Escribe un mensaje...',
            'recordBtn': 'Mantener para hablar',
            'listening': 'Escuchando...'
        },
        'en-US': {
            'send': 'Send',
            'placeholder': 'Type a message...',
            'recordBtn': 'Hold to Speak',
            'listening': 'Listening...'
        }
    };

    const t = translations[language] || translations['en-US'];

    return (
        <div className="controls-area">
            <div className="input-wrapper">
                <button
                    id="record-btn"
                    className={`icon-btn ${isRecording ? 'recording' : ''}`}
                    title={t.recordBtn}
                    onMouseDown={onRecordStart}
                    onMouseUp={onRecordStop}
                    onMouseLeave={onRecordStop}
                    onTouchStart={onRecordStart}
                    onTouchEnd={onRecordStop}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <input
                    type="text"
                    id="message-input"
                    placeholder={t.placeholder}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    id="send-btn"
                    className="icon-btn"
                    title={t.send}
                    onClick={onSend}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
            <div id="recording-status" className={isRecording ? '' : 'hidden'}>
                {t.listening}
            </div>
        </div>
    );
};

export default Controls;
