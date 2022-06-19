const path = require('path');
const session = require('express-session');
const express = require('express');
const app = express();
const routes = require('./controllers');
const server = require('http').Server(app);
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const io = require('socket.io')(server, {});

const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'Super secretive secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use('/client', express.static(path.join(__dirname + '/client')));
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/intro.html');
});

sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Now listening at ${PORT}`));
});

console.log(`Now listening at ${PORT}`);

let SOCKET_LIST = {};

Entity = () => {
  let self = {
    x: 250,
    y: 250,
    spdX: 0,
    spdY: 0,
    id: '',
  };
  self.update = () => {
    self.updatePosition();
  };
  self.updatePosition = () => {
    self.x += self.spdX;
    self.y += self.spdY;
  };
  // finds a point (pt) and finds the distance with a square root
  self.getDistance = (pt) => {
    return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
  };
  return self;
};

Player = (id) => {
  let self = Entity();
  (self.id = id),
    (self.number = '' + Math.floor(10 * Math.random())),
    (self.pressingRight = false),
    (self.pressingLeft = false),
    (self.pressingUp = false),
    (self.pressingDown = false),
    (self.pressingFire = false),
    (self.mouseAngle = 0),
    (self.maxSpd = 10);

  let super_update = self.update;
  self.update = () => {
    self.updateSpd();
    super_update();

    if (self.pressingAttack) {
      self.shootProjectile(self.mouseAngle);
    }
  };
  self.shootProjectile = (angle) => {
    let p = Projectile(self.id, angle);
    p.x = self.x;
    p.y = self.y;
  };

  self.updateSpd = () => {
    if (self.pressingRight) {
      self.spdX = self.maxSpd;
    } else if (self.pressingLeft) {
      self.spdX = -self.maxSpd;
    } else {
      self.spdX = 0;
    }
    if (self.pressingUp) {
      self.spdY = -self.maxSpd;
    } else if (self.pressingDown) {
      self.spdY = self.maxSpd;
    } else {
      self.spdY = 0;
    }
  };
  Player.list[id] = self;
  return self;
};

Player.list = {};

Player.onConnect = (socket) => {
  let player = Player(socket.id);
  socket.on('keyPress', (data) => {
    if (data.inputId === 'left') {
      player.pressingLeft = data.state;
    } else if (data.inputId === 'right') {
      player.pressingRight = data.state;
    } else if (data.inputId === 'up') {
      player.pressingUp = data.state;
    } else if (data.inputId === 'down') {
      player.pressingDown = data.state;
    } else if (data.inputId === 'attack') {
      player.pressingAttack = data.state;
    } else if (data.inputId === 'mouseAngle') {
      player.mouseAngle = data.state;
    }
  });
};

Player.onDisconnect = (socket) => {
  delete Player.list[socket.id];
};

Player.update = () => {
  let pack = [];
  for (let i in Player.list) {
    let player = Player.list[i];
    player.update();
    pack.push({
      x: player.x,
      y: player.y,
      number: player.number,
    });
  }
  return pack;
};

Projectile = (shooter, angle) => {
  let self = Entity();
  self.id = Math.random();
  self.spdX = Math.cos((angle / 180) * Math.PI) * 10;
  self.spdY = Math.sin((angle / 180) * Math.PI) * 10;
  self.shooter = shooter;

  self.timer = 0;
  self.toRemove = false;
  let super_update = self.update;
  self.update = function () {
    if (self.timer++ > 100) {
      self.toRemove = true;
    }
    super_update();

    for (let i in Player.list) {
      let p = Player.list[i];
      if (self.getDistance(p) < 32 && self.shooter !== p.id) {
        // handle collision. ex: hp--;
        self.toRemove = true;
      }
    }
  };
  Projectile.list[self.id] = self;
  return self;
};
Projectile.list = {};

Projectile.update = () => {
  let pack = [];
  for (let i in Projectile.list) {
    let projectile = Projectile.list[i];
    projectile.update();
    if (projectile.toRemove === true) {
      delete Projectile.list[i];
    } else {
      pack.push({
        x: projectile.x,
        y: projectile.y,
      });
    }
  }
  return pack;
};

// set me to false on release!
const DEBUG = true;

io.sockets.on('connection', (socket) => {
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('disconnect', () => {
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  });

  Player.onConnect(socket);
  socket.on('disconnect', () => {
    delete SOCKET_LIST[socket.id];
    Player.onDisconnect(socket);
  });
  socket.on('sendMsgToServer', (data) => {
    let playerName = ('' + socket.id).slice(2, 7);
    for (let i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
    }
    socket.on('evalServer', (data) => {
      if (!DEBUG) {
        return;
      }
      const result = eval(data);
      socket.emit('evalAnswer', result);
    });
  });
  console.log('socket connection');
});

setInterval(() => {
  let pack = {
    player: Player.update(),
    projectile: Projectile.update(),
  };

  for (let i in SOCKET_LIST) {
    let socket = SOCKET_LIST[i];
    socket.emit('newPositions', pack);
  }
}, 40);
