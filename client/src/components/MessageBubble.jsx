import React from 'react';

const MessageBubble = ({ message }) => {
    const { sender, text, isOwn, originalText } = message;

    return (
        <div className={`message ${isOwn ? 'own' : 'other'}`}>
            <div className="message-header">{sender}</div>
            <div className="message-content">{text}</div>
            {originalText && !isOwn && (
                <div className="message-translation">
                    Original: {originalText}
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
