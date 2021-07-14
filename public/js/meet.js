const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header-back");
const dmusers = document.querySelector("#dm-users");
const videoName = document.querySelector(".video-name");
myVideo.muted = true;

backBtn.addEventListener("click", () => {
  document.querySelector(".main-left").style.display = "flex";
  document.querySelector(".main-left").style.flex = "1";
  document.querySelector(".main-right").style.display = "none";
  document.querySelector(".header-back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main-right").style.display = "flex";
  document.querySelector(".main-right").style.flex = "1";
  document.querySelector(".main-left").style.display = "none";
  document.querySelector(".header-back").style.display = "block";
});

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then(stream => {
    myVideoStream = stream;
    addVideoStream(user, myVideo, stream);
    myVideoStream.getAudioTracks()[0].enabled = (audioOff == true ? false: true);
    myVideoStream.getVideoTracks()[0].enabled = (videoOff == true ? false: true);
    if (audioOff) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      html = `<i class="fas fa-microphone-slash"></i>`;
      muteButton.classList.toggle("background-red");
      muteButton.innerHTML = html;
    } else {
      myVideoStream.getAudioTracks()[0].enabled = true;
      html = `<i class="fas fa-microphone"></i>`;
      muteButton.innerHTML = html;
    }
    if (videoOff) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      html = `<i class="fas fa-video-slash"></i>`;
      stopVideo.classList.toggle("background-red");
      stopVideo.innerHTML = html;
    } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      html = `<i class="fas fa-video"></i>`;
      stopVideo.innerHTML = html;
    }


    peer.on("call", call => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", userVideoStream => {
        getPeerIds().then(ids => {
          console.log(call.peer)
          addVideoStream(ids[call.peer], video, userVideoStream);
        })
      });
    });

    socket.on("joined", (id, username) => {
      connectToNewUser(username, id, stream);
      var option = document.createElement("option");
      option.id = "dm_" + username;
      option.innerHTML = username;
      dmusers.appendChild(option);
    });
    socket.on("leave", user => {
      document.querySelector("#user_" + user).remove();
      document.querySelector("#dm_" + user).remove();
    });
  })
  .catch(err => {
    alertmodal("", "To join this meet you must allow access to your microphone and camera.").then(() => location.href = "/join");
  })

function connectToNewUser(username, id, stream){
  const call = peer.call(id, stream);
  const video = document.createElement("video");
  call.on("stream", userVideoStream => {
    addVideoStream(username, video, userVideoStream);
  });
};

peer.on("open", id => {
  socket.emit("joined", room, id, user);
});

function addVideoStream(username, video, stream){
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.id = "user_" + username;
    video.play();
    videoGrid.appendChild(video);
  });
  video.addEventListener("mouseover", e => {
    videoName.style.display = "block";
    videoName.style.left = e.pageX + "px"; 
    videoName.style.top = e.pageY + "px"; 
    videoName.innerHTML = username;
  });
  video.addEventListener("mouseleave", () => {
    videoName.style.display = "none";
  });
  video.addEventListener("contextmenu", e => {
    e.preventDefault();
  });
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background-red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background-red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background-red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background-red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", () => {
  promptmodal("Invite someone", "Enter the user you want to invite to this meet:").then(username => {
    socket.emit("new invitation", {to:username, from:user, room:room});
    alertmodal("Invited!", `You have invited ${username} to this meet!`).then(console.log)
  });
});

document.getElementById("leave").addEventListener("click", () => location.href = "/join");

function getTime(){
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  if(h > 12){
    h = h - 12;
    if(m < 10){
      m = "0" + String(m);
    } 
    d = String(h) + ":" + String(m) + " PM";
    return d;
  }
  else{
    if(m < 10){
      m = "0" + String(m);
    } 
    d = String(h) + ":" + String(m) + " AM";
    return d;
  }
}

async function getPeerIds(){
  let response = await fetch("/peerids");
  return await response.json();
}