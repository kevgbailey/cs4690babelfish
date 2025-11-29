import { useState, useEffect, useRef, useCallback } from 'react';

export const useTextToSpeech = (defaultLanguage = 'en-US') => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        const updateVoices = () => {
            setVoices(synthRef.current.getVoices());
        };

        updateVoices();
        // Chrome loads voices asynchronously
        if (synthRef.current.onvoiceschanged !== undefined) {
            synthRef.current.onvoiceschanged = updateVoices;
        }
    }, []);

    const speak = useCallback((text, options = {}) => {
        console.log("speak", text);
        if (!text) return;

        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = options.lang || defaultLanguage;
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        if (options.voice) {
            utterance.voice = options.voice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error', event);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        synthRef.current.speak(utterance);
    }, [defaultLanguage]);

    const cancel = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, []);

    const pause = useCallback(() => {
        if (synthRef.current && synthRef.current.speaking) {
            synthRef.current.pause();
            setIsPaused(true);
        }
    }, []);

    const resume = useCallback(() => {
        if (synthRef.current && synthRef.current.paused) {
            synthRef.current.resume();
            setIsPaused(false);
        }
    }, []);

    return {
        speak,
        cancel,
        pause,
        resume,
        isSpeaking,
        isPaused,
        voices
    };
};
