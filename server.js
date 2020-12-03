const fs=require(`fs`);
const http=require(`http`);
const { title } = require("process");
require(`dotenv`).config();
const server=require(`express`)();
const httpServer=http.createServer(server);
const ioClient=require(`socket.io-client`);
const io=require(`socket.io`)(httpServer);
const port=process.env.port||80;
server.get(`/`,(req,res)=>{res.sendFile(__dirname+`/index.html`);});
server.get(`/room`,(req,res)=>{res.sendFile(__dirname+`/app.html`);});
server.get(`*`,(req,res)=>{
if(!req.originalUrl.includes(`?`)){res.sendFile(__dirname+`/${req.originalUrl}`);}
});
io.on(`connection`,socket=>{
console.log(`New connection`);
socket.on(`get-ping`,(start)=>{socket.emit(`ping-reply`,start);});
socket.on(`send`,(data)=>{
socket.broadcast.emit(`message`,{userId:socket.id,content:data.content,room:data.room,username:data.username});
socket.emit(`sent`,data.id);
});
socket.on(`disconnect`,()=>{console.log(`Disconnection`);}
);
});
httpServer.listen(port,async ()=>{console.log(`Server started at port ${port}`);});