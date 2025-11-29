import { useState, useEffect, useRef, useCallback } from 'react';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const socketRef = useRef(null);
    const [user, setUser] = useState(null);

    const setupUser = useCallback((username, language) => {
        setUser({ username, language });
    }, []);

    const connect = useCallback((username, language) => {
        setupUser(username, language);

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // In dev, we might be on port 5173, but server is on 3000.
        // We need to connect to port 3000 if we are in dev mode.
        const host = window.location.hostname;
        const port = window.location.port === '5173' ? '3000' : window.location.port;
        const wsUrl = `${protocol}//${host}:${port}`;

        console.log('Connecting to:', wsUrl);

        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            console.log('Connected to server');
            setConnectionStatus('Connected');
            setIsConnected(true);

            socketRef.current.send(JSON.stringify({
                type: 'join',
                name: username,
                language: language
            }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat') {
                setMessages((prev) => [...prev, data]);
            } else if (data.type === 'system') {
                console.log('System:', data.text);
            }
        };

        socketRef.current.onclose = () => {
            console.log('Disconnected from server');
            setConnectionStatus('Disconnected');
            setIsConnected(false);
        };
    }, [setupUser]);

    const record = useCallback((username, language) => {
        console.log("record", username, language);
        setupUser(username, language);
        setIsRecording(true);
    }, [setupUser]);

    const sendMessage = useCallback((text) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'chat',
                text: text
            }));
        } else {
            alert('Not connected to server');
        }
    }, []);

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return {
        messages,
        connectionStatus,
        isConnected,
        connect,
        setupUser,
        isRecording,
        record,
        sendMessage,
        user
    };
};
