const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const Message = require('./models/Message');
const ws = require('ws');

const  authRoutes = require ('./routes/auth.routes.js')
const peopleRoutes = require('./routes/people.routes.js')
const messageRoutes = require('./routes/message.routes.js')
const profileRoutes = require('./routes/profile.routes.js')
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL, (err) => {
  if (err) throw err;
  console.log("DB connected")
});

const app = express();
const server = app.listen(4040,()=>{
    console.log("connected")
  });

  
  app.use(express.json());
  app.use(cookieParser());
  
  app.use(cors({  credentials: true,
    origin: 'http://localhost:5173',}));
    

app.use('/people', peopleRoutes);

app.use('/auth',authRoutes);

app.use('/messages',messageRoutes);

app.use('/profile',profileRoutes);

const wss = new ws.WebSocketServer({server});

wss.on('connection',async(connection, req ) => {



  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
      }));
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log('dead');
    }, 1000);
  }, 5000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const {userId, username} = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipient, text, file} = messageData;
    
  

    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender:connection.userId,
        recipient,
        text: text==''?'Photo.jpg':text,
        file: file ? file.downloadURL : null,
      });
    
      console.log('created message');
      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender:connection.userId,
          recipient,
          file: file ? file.downloadURL : null,
          _id:messageDoc._id,
        })));
    }
  });

  notifyAboutOnlinePeople();
} );
