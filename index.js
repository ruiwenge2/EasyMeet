const express = require("express");
const app = express();
const server = require("http").Server(app);
const {v4:uuid} = require("uuid");
const io = require("socket.io")(server);

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const Database = require("@replit/database");
const db = new Database();

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

const f = require("./functions");
const users = {};
const peerIds = {};

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static("public"));
app.use("/peerjs", peerServer);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  f.checkUser(req).then(result => {
    if(result){
      res.render("index.html", {loggedIn:f.loggedIn(req), user:f.getUser(req)});
    } else{
      res.redirect("/logout");
    }
  });
});

app.get("/login", (req, res) => {
  loggedIn = req.cookies.loggedIn;
  if(loggedIn == "true"){
    res.redirect("/");
  } else{
    res.render("login.html", {loggedIn:f.loggedIn(req)});
  }
})

app.get("/signup", (req, res) => {
  loggedIn = req.cookies.loggedIn;
  if(loggedIn == "true"){
    res.redirect("/");
  } else{
    res.render("signup.html", {loggedIn:f.loggedIn(req)});
  }
});

app.post("/loginsubmit", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  db.list().then(keys => {
    if(keys.includes(username)){
      db.get(username).then(value => {
        if(password == value.password){
          res.cookie("loggedIn", "true");
          res.cookie("userid", value.userid)
          res.cookie("username", username);
          console.log("logged in successfully")
          res.redirect("/");
        } else{
          res.render("message.html", {message:"Wrong password.", loggedIn:f.loggedIn(req)});
        }
      });
    } else{
      res.render("message.html", {message:"Account not found.", loggedIn:f.loggedIn(req)});
    }
  });
});

app.post("/createaccount", (req, res) => {
  var newusername = req.body.newusername;
  var newpassword = req.body.newpassword;
  var captcha_response = req.body["g-recaptcha-response"];
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  cap_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  allchars = letters + cap_letters + numbers + ['_'];
  goodusername = true;
  for(let i of newusername){
    if(!allchars.includes(i)){
      goodusername = false;
    }
  }
  if(goodusername){
    db.list().then(keys => {
      if(keys.includes(newusername)){
        res.render("message.html", {message:"Username taken.", loggedIn:f.loggedIn(req)});
      } else if(newusername == ""){
        res.render("message.html", {message:"Please enter a username.", loggedIn:f.loggedIn(req)});
      } else if(newpassword == ""){
        res.render("message.html", {message:"Please enter a password.", loggedIn:f.loggedIn(req)});
      } else if(newusername == process.env["not_allowed"]){
        res.render("message.html", {message:"That cannot be your username.", loggedIn:f.loggedIn(req)});
      } else{
        const userid = uuid();
        let info = {
          userid: userid,
          password: newpassword,
          audioOff:true,
          videoOff:true
        }
        f.is_human(captcha_response).then(resp => {
          if(!resp){
            res.render("message.html", {message:"No bots allowed!", loggedIn:f.loggedIn(req)});
            return;
          }
          db.set(newusername, info).then(() => {
            console.log(userid);
            console.log(newusername);
            console.log("new account created");
          });
          res.cookie("loggedIn", "true");
          res.cookie("userid", userid)
          res.cookie("username", newusername);
          res.redirect("/");
        });
      }
    });
  } else{
    res.render("message.html", {message:"Username can only contain alphanumeric characters and underscores.", loggedIn:f.loggedIn(req)});
  }
});

app.get("/logout", (req, res) => {
  res.cookie("loggedIn", "false");
  res.clearCookie("username");
  res.redirect("/");
  console.log("successfully logged out")
});

app.get("/meet/:room", (req, res) => {
  if(f.loggedIn(req)){
    f.checkUser(req).then(result => {
      if(result){
        f.getInfo(req).then(info => {
          let room = req.params.room;
          if(!users[room]) users[room] = {};
          let all = Object.values(users[room]);
          if(all.includes(f.getUser(req))){
            res.render("message.html", {message:"You already joined this room!", loggedIn:f.loggedIn(req), user:f.getUser(req)});
            return;
          }
          res.render("meet.html", {room: room, user:f.getUser(req), allusers:all, audioOff:info.audioOff, videoOff:info.videoOff, peerIds:JSON.stringify(peerIds)});
        });
      } else {
        res.redirect("/logout");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/join", (req, res) => {
  if(f.loggedIn(req)){
    f.checkUser(req).then(result => {
      if(result){
        f.getInfo(req).then(info => {
          res.render("join.html", {loggedIn:f.loggedIn(req), audioOff:info.audioOff, videoOff:info.videoOff, user:f.getUser(req)});
        });
      } else {
        res.redirect("/logout");
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/submitsettings", async (req, res) => {
  if(f.loggedIn(req)){
    let audioOff = req.query.audioOff;
    let videoOff = req.query.videoOff;
    let info = await db.get(f.getUser(req));
    if(audioOff == "on"){
      info["audioOff"] = true;
    } else {
      info["audioOff"] = false;
    }
    if(videoOff == "on"){
      info["videoOff"] = true;
    } else {
      info["videoOff"] = false;
    }
    const change = await db.set(f.getUser(req), info);
    console.log("changed settings");
    res.redirect("/join");
  } else {
    res.redirect("/");
  }
});

app.get("/help", (req, res) => {
  f.checkUser(req).then(result => {
    if(result){
      res.render("help.html", {loggedIn:f.loggedIn(req), user:f.getUser(req)});
    } else {
      res.redirect("/logout");
    }
  });
});

app.get("/meet", (req, res) => {
  res.redirect("/join");
});

app.get("/peerids", (req, res) => {
  res.send(peerIds);
});

app.get("/*", (req, res) => {
  f.checkUser(req).then(result => {
    if(result){
      res.status(404).render("404.html", {loggedIn:f.loggedIn(req), user:f.getUser(req)});
    } else {
      res.redirect("/logout");
    }
  });
});

io.on("connection", socket => {
  socket.on("joined", (room, id, user) => {
    if(!users[room]) users[room] = {};
    users[room][socket.id] = user;
    socket.join(room);
    peerIds[id] = user;
    socket.broadcast.to(room).emit("joined", id, user);
    console.log(`${user} joined the room ${room}`);
  });
  socket.on("message", (message, room, user) => {
    io.to(room).emit("message", message, user)
  });
  socket.on("disconnect", () => {
    var left;
    for(i of Object.keys(users)){
      if(Object.keys(users[i]).includes(socket.id)){
        left = users[i][socket.id];
        delete users[i][socket.id];
        io.to(i).emit("leave", left);
        console.log(`${left} left the room ${i}`);
      }
    }
    for(j of Object.keys(peerIds)){
      if(peerIds[j] == left){
        delete peerIds[j];
        return;
      }
    }
  });
  socket.on("private message", (message, room, sender, reciever) => {
    io.to(room).emit("private message", message, sender, reciever);
  });
  socket.on("new invitation", invitation => {
    io.emit("new invitation", invitation);
    console.log(`${invitation.from} invited ${invitation.to} to the room ${invitation.room}`);
  });
});

server.listen(3000, () => {
  console.log("server started");
});