const socket=io();
const room=decodeURIComponent(new URLSearchParams(window.location.search).get('room'));
const username=decodeURIComponent(new URLSearchParams(window.location.search).get('username'));
document.getElementById(`room`).innerHTML=room;
document.getElementById(`username`).innerHTML=username;
document.title=`${username} - ${room} | Room discuss`;
socket.on(`connect`,()=>{
document.getElementById(`status`).innerHTML=`Connected`;
document.getElementById(`status`).classList=`green`;
});
socket.on(`disconnect`,()=>{
document.getElementById(`status`).innerHTML=`Disconnected`;
document.getElementById(`status`).classList=`red`;
document.getElementById(`ping`).innerHTML=`-`;
document.getElementById(`ping`).classList=`red`;
});
socket.on(`ping-reply`,(start)=>{
var ping=new Date().getTime()-start;
document.getElementById(`ping`).innerHTML=`${ping}ms`;
if(ping>=0&&ping<=50){document.getElementById(`ping`).classList=`lime`;}
if(ping>50&&ping<=100){document.getElementById(`ping`).classList=`green`;}
if(ping>150&&ping<=200){document.getElementById(`ping`).classList=`yellow`;}
if(ping>200&&ping<=250){document.getElementById(`ping`).classList=`orange`;}
if(ping>250||isNaN(ping)){document.getElementById(`ping`).classList=`red`;}
});
setInterval(function(){socket.emit(`get-ping`,new Date().getTime());},1000);
function sendMessage(){
var content=document.getElementById(`message-content`).value,id=Math.round(Math.random()*1000000);
var message=document.createElement(`div`);
message.id=id;
message.classList=`message`;
message.innerHTML=`<div class='username'><cyan>${username}</cyan></div><div class='content'>${content}</div><div class='status orange'>Not sent</div>`;
document.getElementById(`messages`).appendChild(message);
socket.emit(`send`,{content:content,id:id,room:room,username:username});
document.getElementById(`message-content`).value=``;
document.getElementById(`messages`).scrollTop=document.getElementById(`messages`).scrollHeight;
}
socket.on(`message`,(data)=>{
if(data.room==room){
var message=document.createElement(`div`);
message.id=data.id;
message.classList=`message`;
message.innerHTML=`<div class='username'>${data.username}</div><div class='content'>${data.content}</div>`;
document.getElementById(`messages`).appendChild(message);
document.getElementById(`messages`).scrollTop=document.getElementById(`messages`).scrollHeight;
}});
socket.on(`sent`,(data)=>{
document.getElementById(data).getElementsByClassName(`status`)[0].innerHTML=`Sent`;
document.getElementById(data).getElementsByClassName(`status`)[0].classList=`status green`;
});
document.getElementById(`message-content`).addEventListener(`keypress`,e=>{if(e.keyCode==13){sendMessage();}});