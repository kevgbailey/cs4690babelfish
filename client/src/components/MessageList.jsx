import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div id="messages-container" ref={containerRef}>
            {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
            ))}
        </div>
    );
};

export default MessageList;
