const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const app = express();
const server = require('http').Server(app);
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const io = require('socket.io')(server, {});
const { Entity, Player, Projectile } = require('./Entities');
const { Inventory, Item } = require('../client/src/Inventory');
const { authMiddleware } = require('./utils/auth');
const apolServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const PORT = process.env.PORT || 3001;

// middleware
app.use('/client', express.static(path.join(__dirname + '../client')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async (typeDefs, resolvers) => {
  await apolServer.start();
  apolServer.applyMiddleware({ app });
};

db.once('open', () => {
  server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}!`);
    console.log(
      `Use GraphQL at http://localhost:${PORT}${apolServer.graphqlPath}`
    );
  });
});

startApolloServer(typeDefs, resolvers);

let SOCKET_LIST = {};

// set me to false on release!
const DEBUG = true;

io.sockets.on('connection', (socket) => {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  // socket.on('signIn', (data) => {
  //   isValidPassword(data, (res) => {
  //     if (res) {
  //       Player.onConnect(socket, data.username);
  //       socket.emit('signInResponse', { success: true });
  //     } else {
  //       socket.emit('signInResponse', { success: false });
  //     }
  //   });
  // });
  socket.on('clientReady', ()=>{
    Player.onConnect(socket);
    // every frame update the game state and empty arrays to avoid duplication
    setInterval(() => {
      const packs = Entity.getFrameUpdateData();
      for (let i in SOCKET_LIST) {
        let socket = SOCKET_LIST[i];
        socket.emit('init', packs.initPack);
        socket.emit('update', packs.updatePack);
        socket.emit('remove', packs.removePack);
      }
    }, 40);
  });

  socket.on('sendMessage', (data)=> {
    console.log('the chat message is: ', data);
    socket.emit('receiveMessage', data);
  })
  socket.on('disconnect', () => {
    console.log('On disconnect activated');
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  });
});