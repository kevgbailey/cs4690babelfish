import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../dist');

// MongoDB Connection (Extra Credit)
// Using a local instance or a placeholder string if not available.
// Ideally, this should be an env var.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/babelfish';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.warn('MongoDB connection error (Extra Credit features may be limited):', err.message));

// Define Translation Schema (Extra Credit)
const translationSchema = new mongoose.Schema({
    sourceText: String,
    sourceLang: String,
    targetLang: String,
    translatedText: String,
    createdAt: { type: Date, default: Date.now }
});
const Translation = mongoose.model('Translation', translationSchema);


const server = http.createServer((req, res) => {
    // Basic Static File Server
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Serve index.html for client-side routing if file not found (SPA fallback)
                // But only if it's not an asset request (to avoid infinite loops for missing assets)
                if (!extname || extname === '.html') {
                    fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err, indexContent) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('500 Internal Server Error');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(indexContent, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(404);
                    res.end('404 Not Found');
                }
            } else {
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// WebSocket Server
const wss = new WebSocketServer({ server });

const clients = new Map(); // Store client metadata: id -> { ws, name, language }

wss.on('connection', (ws) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.log(`Client connected: ${id}`);

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'join') {
                clients.set(id, {
                    ws,
                    name: data.name,
                    language: data.language
                });
                console.log(`User joined: ${data.name} (${data.language})`);

                // Broadcast join message (optional, but good for UX)
                broadcast({
                    type: 'system',
                    text: `${data.name} joined the chat.`
                });
            } else if (data.type === 'chat') {
                const sender = clients.get(id);
                if (!sender) return;

                console.log(`Message from ${sender.name}: ${data.text}`);

                // Broadcast to all clients
                // We need to translate for each client based on their language
                // For efficiency, we could cache translations for this message

                const messagePromises = Array.from(clients.values()).map(async (client) => {
                    if (client.ws.readyState === WebSocket.OPEN) {
                        let textToSend = data.text;
                        let originalText = null;

                        // If client language is different from sender language, translate
                        if (client.language !== sender.language) {
                            textToSend = await translateText(data.text, sender.language, client.language);
                            originalText = data.text; // Send original for reference (Extra Credit)
                        }

                        client.ws.send(JSON.stringify({
                            type: 'chat',
                            sender: sender.name,
                            text: textToSend,
                            originalText: originalText,
                            isOwn: client === sender,
                            lang: client.language
                        }));
                    }
                });

                await Promise.all(messagePromises);
            }
        } catch (e) {
            console.error('Error handling message:', e);
        }
    });

    ws.on('close', () => {
        const client = clients.get(id);
        if (client) {
            console.log(`Client disconnected: ${client.name}`);
            broadcast({
                type: 'system',
                text: `${client.name} left the chat.`
            });
            clients.delete(id);
        }
    });
});

function broadcast(msg) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

// Translation Service (Mock + DB Cache)
async function translateText(text, sourceLang, targetLang) {

    const source = sourceLang.split('-')[0];
    const target = targetLang.split('-')[0];

    const url = `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();
    const translated = data.translation;

    return translated;
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
