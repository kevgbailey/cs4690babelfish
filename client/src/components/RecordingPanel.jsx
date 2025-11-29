import { useSpeech } from '../hooks/useSpeech';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import './RecordingPanel.css';

const RecordingPanel = ({ user }) => {
    const [transcript, setTranscript] = useState('');
    const { isRecording, startRecording, stopRecording } = useSpeech(user?.language);
    const { translate, translation, loading, error } = useTranslation();
    const { speak } = useTextToSpeech(user?.language == 'en-US' ? 'es-ES' : 'en-US');

    const handleRecordStart = async () => {
        startRecording(async (transcript) => {
            setTranscript(transcript);
            const targetLang = user.language === 'en-US' ? 'es-ES' : 'en-US';
            const result = await translate(transcript, user.language, targetLang);
            console.log("translation", result);
            speak(result);
        });
    };

    const handleRecordStop = () => {
        stopRecording();
    };

    return (
        <div id="recording-panel" className="panel">
            <div className="recording-controls">
                <button
                    id="record-btn"
                    className={`icon-btn large-btn ${isRecording ? 'recording' : ''}`}
                    title="Hold to Speak"
                    onMouseDown={handleRecordStart}
                    onMouseUp={handleRecordStop}
                    onMouseLeave={handleRecordStop}
                    onTouchStart={handleRecordStart}
                    onTouchEnd={handleRecordStop}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <p className="instruction-text">{isRecording ? 'Listening...' : 'Hold to Speak'}</p>
            </div>

            <div className="text-display">
                <div className="text-group">
                    <label>You said:</label>
                    <p className="transcript-text">{transcript || '...'}</p>
                </div>
                <div className="text-group">
                    <label>Translation:</label>
                    <p className="translation-text">{translation || '...'}</p>
                </div>
            </div>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default RecordingPanel;
