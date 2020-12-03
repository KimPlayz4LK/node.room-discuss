const socket=io();
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
document.getElementById(`room`).addEventListener(`keypress`,e=>{if(e.keyCode==13){document.getElementById(`join`).click();}});
document.getElementById(`username`).addEventListener(`keypress`,e=>{if(e.keyCode==13){document.getElementById(`join`).click();}});
function joinRoom(){location.href=`room?room=${document.getElementById(`room`).value}&username=${document.getElementById(`username`).value}`;}