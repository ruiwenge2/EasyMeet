const axios = require('axios');
const Database = require("@replit/database");
const db = new Database();

async function is_human(captcha_response){
  let secret = process.env["captcha_secret"];
  let payload = {response:captcha_response, secret:secret};
  let result = await axios({
    method:"POST",
    url: "https://www.google.com/recaptcha/api/siteverify",
    params:payload,
  });
  return result.data.success;
}

function loggedIn(req){
  return (req.cookies.loggedIn == "true" ? true: false);
}

function getUser(req){
  return req.cookies.username;
}

async function checkUser(req){
  let loggedIn = req.cookies.loggedIn;
  let username = req.cookies.username;
  let userid = req.cookies.userid;
  if(loggedIn != "true") return true;
  const keys = await db.list();
  if(keys.includes(username)){
    const userInfo = await db.get(username);
    if(userid == userInfo.userid){
      return true;
    }
  }
  return false;
}

async function getInfo(req){
  let username = req.cookies.username;
  const info = await db.get(username);
  return {videoOff:info.videoOff, audioOff:info.audioOff};
}

module.exports = {
  is_human:is_human,
  loggedIn:loggedIn,
  getUser:getUser,
  checkUser:checkUser,
  getInfo:getInfo
};