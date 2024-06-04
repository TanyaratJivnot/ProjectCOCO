/* const WebSocket = require('ws');

let wss;

function setupWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Send initial data to the client
        ws.send(JSON.stringify(global.list_predict_products || global.list_predict_undata));

        // Handle messages from client
        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        // Handle client disconnect
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
}

function broadcast(data) {
    if (!wss) return;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

module.exports = { setupWebSocket, broadcast };
 */