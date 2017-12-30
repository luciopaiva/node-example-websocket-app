"use strict";

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = 3000;

app.use(express.static("node_modules"));
app.use(express.static("public"));
server.listen(PORT, () => console.info(`Server listening on port ${PORT}...`));

const QUOTES = [
    "If I won the award for laziness, I would send somebody to pick it up for me",
    "If we shouldn't eat at night, why is there a light in the fridge?",
    "Some people are like clouds. When they go away, it's a brighter day",
    "Sometimes I wish I was an octopus, so I could slap eight people at once",
    "Maybe if we tell people the brain is an app, they'll start using it"
];

class ClientState {
    constructor () {
        this.nextQuoteIndex = 0;
    }
}

/** @type {Map<Object, ClientState>} */
const clientStateBySocket = new Map();

function sendMessage(socket) {
    const state = clientStateBySocket.get(socket);

    const quote = QUOTES[state.nextQuoteIndex];
    state.nextQuoteIndex = (state.nextQuoteIndex + 1) % QUOTES.length;
    console.info(`Sending message "${quote}" to socket ${socket.id}...`);
    socket.emit("message", quote);
}

io.on("connection", socket => {
    console.info(`Socket ${socket.id} connected.`);
    clientStateBySocket.set(socket, new ClientState());
    socket.on("message", () => sendMessage(socket));
    socket.on("disconnect", () => {
        clientStateBySocket.delete(socket);
        console.info(`Socket ${socket.id} disconnected`);
    });
});
