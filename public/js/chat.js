var focus = true;

window.onblur = function(){
  focus = false;
}
window.onfocus = function(){
  focus = true;
}

socket.on("message", (message, username) => {
  const d = getTime();
  messages.innerHTML += `<div class="message"><b>${username} to Everyone</b> <span style="color:gray">${d}</span><p style="overflow-x:auto">${decodeHTML(message)}</p></div><br>`;
  messages.scrollTo(0, messages.scrollHeight);
  if(!focus && username != user) document.getElementById("chat-alert").play();
});

socket.on("private message", (message, sender, reciever) => {
  if(user == sender || user == reciever){
    const d = getTime();
    messages.innerHTML += `<div class="message"><b>${sender} to ${reciever} (<span style="color:#f6484a">Privately</span>)</b> <span style="color:gray">${d}</span><p style="overflow-x:auto">${decodeHTML(message)}</p></div><br>`;
    messages.scrollTo(0, messages.scrollHeight);
    if(user == reciever) document.getElementById("dm-users").value = sender;
    if(!focus && sender != user) document.getElementById("chat-alert").play();
  }
});

send.addEventListener("click", e => {
  if(validMessage(text.value)) {
    sendMessage(text.value);
  }
});

text.addEventListener("keydown", e => {
  if(e.key === "Enter" && validMessage(text.value)) {
    sendMessage(text.value);
  }
});

function sendMessage(message){
  var reciever = document.getElementById("dm-users").value;
  if(reciever == "Everyone"){
    socket.emit("message", message, room, user);
  } else {
    socket.emit("private message", message, room, user, reciever);
  }
  text.value = "";
  text.focus();
}

function decodeHTML(text){
  var div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function validMessage(message){
  if(!message) return false;
  for(var i of message){
    if(i != " ") return true;
  }
  return false;
}