var socket = io();

socket.on("new invitation", invitation => {
  if(invitation.to != user) return;
  document.getElementById("sound").play();
  confirmmodal("You are invited!", `${invitation.from} has invited you to join the room <span style="color:blue">${invitation.room}</span>. Do you want to join?`, ok="Join").then(() => location.href = "/meet/" + invitation.room);
});