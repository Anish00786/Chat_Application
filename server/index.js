const express = require('express')
const app = express()
const PORT = 8080
const cors = require('cors')
const http = require('http')
let users=[];
const server = http.createServer(app)

const socketIO = require('socket.io')(server,{
    cors:{
        origin: 'http://localhost:3000',
    }
})  

socketIO.on('connection', (socket) => {
    console.log(`🔥: ${socket.id} user just connected`)

    //New user when joined then it will be push it into the data and then send to the frontend emited.
socket.on('newUser',(data)=>{
    users.push(data)
    socketIO.emit('newUserResponse',users)
})
//Whenever user get disconnected then 
    socket.on('disconnect', () => {
        console.log('A user just got disconnected')
        users=users.filter(user => user.socketID !== socket.id);
        socketIO.emit('newUserResponse',users);
    })
    //we are printing here the data what we have make in the chatfooter file
socket.on('message',(data)=>{
    console.log(data)
    socketIO.emit('messageResponse', data)
})
})


app.use(cors())

app.get('/api', (req,res) => {
    res.send('Hello World')
})


server.listen(PORT, () => {
    console.log('Server started at ' + PORT)
})