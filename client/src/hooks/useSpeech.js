import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeech = (language) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = language || 'en-US';

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsRecording(false);
            };
        } else {
            console.warn('Speech Recognition API not supported in this browser.');
        }
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language || 'en-US';
        }
    }, [language]);

    const startRecording = useCallback((onResult) => {
        if (recognitionRef.current) {
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onResult(transcript);
            };
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
            }
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const speak = useCallback((text, lang) => {
        if (synthRef.current.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        if (text !== '') {
            const utterThis = new SpeechSynthesisUtterance(text);
            utterThis.lang = lang || 'en-US';
            synthRef.current.speak(utterThis);
        }
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording,
        speak
    };
};
