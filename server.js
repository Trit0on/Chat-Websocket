const Websocket = require("ws");

const wss = new Websocket.Server({ port: 8080 });

console.log("WebSocket server started on ws://localhost:8080");

wss.on("connection", (ws) => {
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === Websocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
  // Server create a new connection
  console.log("New client connected");

  ws.send(
    JSON.stringify({
      type: "welcome",
      pseudo: "server",
      message: "Welcome to the WebSocket server!",
    })
  );

  ws.on("message", (msg) => {
    // The server detects a message from the user
    const data = JSON.parse(msg.toString());
  });

  ws.on("close", () => {
    broadcast({
      type: "leave",
      user: ws.user,
      message: "A user has left the chat.",
    });
      console.log("Client disconnected")

  });
});
