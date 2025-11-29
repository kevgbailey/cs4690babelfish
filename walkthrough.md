# Babel Fish Walkthrough

## Overview
Babel Fish is a real-time translation web application that allows English and Spanish speakers to communicate seamlessly. It uses the Web Speech API for speech-to-text and text-to-speech, and a Node.js WebSocket server for real-time message broadcasting and translation.

## Features Implemented
- **Phase I**:
    - Speech-to-Text (English & Spanish)
    - Text-to-Speech (English & Spanish)
    - Translation Integration (Mock service for demonstration)
- **Phase II**:
    - WebSocket Server (`ws`)
    - Real-time Message Broadcasting
    - Client Connection Management (ID, Name, Language)
- **Extra Credit**:
    - **UI Localization**: Interface text changes based on selected language.
    - **User Names**: Users are identified by name in the chat.
    - **MongoDB Integration**: Caches translations in MongoDB (graceful fallback if DB not available).

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Application**
   You can run both the server and the client with a single command:
   ```bash
   npm run dev:full
   ```
   This will start:
   - The Node.js WebSocket server on port 3000
   - The Vite development server (usually on port 5173)

3. **Access the Application**
   Open your browser and navigate to the Vite URL shown in the terminal (e.g., `http://localhost:5173`).

## Verification Steps

### 1. Basic Translation (Phase I)
1. Open the app.
2. Select "English" and enter a name.
3. Click "Connect".
4. Type "Hello" and send.
5. You should see your message.
6. (Note: To hear the translation, you need a second client connected with a different language, or rely on the mock "echo" if configured).

### 2. Real-time Communication (Phase II)
1. Open two browser windows/tabs.
2. **Tab 1**: Join as "Alice" (English).
3. **Tab 2**: Join as "Carlos" (Español).
4. **Tab 1**: Type "Hello" and send.
   - **Tab 1** sees: "Hello"
   - **Tab 2** sees: "hola" (Translated) and hears "hola".
5. **Tab 2**: Type "Gracias" and send.
   - **Tab 2** sees: "Gracias"
   - **Tab 1** sees: "thank you" (Translated) and hears "thank you".

### 3. Localization (Extra Credit)
1. On the setup screen, change the language to "Español".
2. Verify that "Connect" changes to "Conectar" and "Name" changes to "Nombre".

## Architecture
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Web Speech API, WebSocket API).
- **Backend**: Node.js, `ws` library, `mongoose` (optional).
- **Translation**: Currently using a mock dictionary for reliability during testing. In production, this would call an external API.

## Known Issues / Notes
- **Browser Support**: Web Speech API is best supported in Chrome/Edge.
- **MongoDB**: If a local MongoDB instance is not running on `localhost:27017`, the app will log a warning but continue to function using the mock translation service without caching.

## TODO
Need to make the initial functionality of typing in english and hearing the translation in spanish work.
 - probably make a button in the setup panel to run a separate function that will do this. Just with a record button that listens, then translates.
