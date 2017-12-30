"use strict";

window.addEventListener("load", () => {
    console.info("Connecting...");
    const socket = io.connect();
    const span = document.querySelector("span");

    function requestQuote() {
        if (socket.connected) {
            socket.emit("message");
        }
    }

    socket.on("connect", () => {
        console.info("Connected!");
        requestQuote();
        setInterval(() => requestQuote(), 3000);
    });

    socket.on("reconnect", () => {
        console.info("Reconnected!");
    });

    socket.on("disconnect", () => {
        console.info("Disconnected");
    });

    socket.on("message", message => {
        console.info("Received message!");
        span.innerText = message;
    });
});
