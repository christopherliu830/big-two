const socket = io('ws://localhost:3000');

socket.emit('registration');

socket.onAny(data => {
  document.body.innerHTML = `<div>${data}</div>`;
})