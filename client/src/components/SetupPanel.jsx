import React, { useState } from 'react';

const SetupPanel = ({ onConnect, onRecord }) => {
    const [username, setUsername] = useState('');
    const [language, setLanguage] = useState('en-US');

    const handleConnect = () => {
        if (username.trim()) {
            onConnect(username, language);
        } else {
            alert('Please enter your name');
        }
    };

    const handleRecord = () => {
        if (username.trim()) {
            onRecord(username, language);
        } else {
            alert('Please enter your name');
        }
    };

    const translations = {
        'es-ES': {
            'setupTitle': 'Unirse a la conversación',
            'labelName': 'Nombre',
            'labelLanguage': 'Idioma',
            'connectBtn': 'Conectar',
            'placeholder': 'Ingresa tu nombre',
            'recordBtn': 'Grabar'
        },
        'en-US': {
            'setupTitle': 'Join Conversation',
            'labelName': 'Name',
            'labelLanguage': 'Language',
            'connectBtn': 'Connect',
            'placeholder': 'Enter your name',
            'recordBtn': 'Record'
        }
    };

    const t = translations[language] || translations['en-US'];

    return (
        <div id="setup-panel" className="panel">
            <h2 id="setup-title">{t.setupTitle}</h2>
            <div className="form-group">
                <label htmlFor="username" id="label-username">{t.labelName}</label>
                <input
                    type="text"
                    id="username"
                    placeholder={t.placeholder}
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="language" id="label-language">{t.labelLanguage}</label>
                <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="en-US">English</option>
                    <option value="es-ES">Español</option>
                </select>
            </div>
            <button id="connect-btn" className="primary-btn" onClick={handleConnect}>
                {t.connectBtn}
            </button>
            <button id="record-btn" className="primary-btn" onClick={handleRecord}>
                {t.recordBtn}
            </button>
        </div>
    );
};

export default SetupPanel;
