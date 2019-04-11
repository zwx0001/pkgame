let uid = window.localStorage.getItem("uid")
  ? window.localStorage.getItem("uid")
  : "";

const io = require("socket.io-client");

var socket = io(`ws://192.168.2.28:8888?uid=${uid}`, {
  autoConnect: false
});

export default socket;
