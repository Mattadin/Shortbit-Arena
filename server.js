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
  self.id = id;
  self.number = '' + Math.floor(10 * Math.random());
  self.pressingRight = false;
  self.pressingLeft = false;
  self.pressingUp = false;
  self.pressingDown = false;
  self.pressingAttack = false;
  self.mouseAngle = 0;
  self.maxSpd = 10;
  self.hp = 100;
  self.hpMax = 100;
  self.level = 0;

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

  self.getInitPack = () => {
    return {
      id: self.id,
      x: self.x,
      y: self.y,
      number: self.number,
      hp: self.hp,
      hpMax: self.hpMax,
      level: self.level,
    };
  };

  self.getUpdatePack = () => {
    return {
      id: self.id,
      x: self.x,
      y: self.y,
      hp: self.hp,
      level: self.level,
    };
  };

  Player.list[id] = self;

  initPack.player.push(self.getInitPack());
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

  socket.emit('init', {
    player: Player.getAllInitPack(),
    projectile: Projectile.getAllInitPack(),
  });
};

Player.getAllInitPack = () => {
  let players = [];
  for (let i in Player.list) {
    players.push(Player.list[i].getInitPack());
  }
  return players;
};

Player.onDisconnect = (socket) => {
  delete Player.list[socket.id];
  removePack.player.push(socket.id);
};

Player.update = () => {
  let pack = [];
  for (let i in Player.list) {
    let player = Player.list[i];
    player.update();
    pack.push(player.getUpdatePack());
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
        p.hp -= 5;
        if (p.hp <= 0) {
          let shooter = Player.list[self.shooter];
          if (shooter) {
            shooter.level += 1;
          }
          p.hp = p.hpMax;
          p.x = Math.random() * 500;
          p.y = Math.random() * 500;
        }
        self.toRemove = true;
      }
    }
  };
  self.getInitPack = () => {
    return {
      id: self.id,
      x: self.x,
      y: self.y,
    };
  };

  self.getUpdatePack = () => {
    return {
      id: self.id,
      x: self.x,
      y: self.y,
    };
  };
  Projectile.list[self.id] = self;
  initPack.projectile.push(self.getInitPack());
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
      removePack.projectile.push(projectile.id);
    } else {
      pack.push(projectile.getUpdatePack());
    }
  }
  return pack;
};

Projectile.getAllInitPack = () => {
  let projectiles = [];
  for (let i in Projectile.list) {
    projectiles.push(Projectile.list[i].getInitPack());
  }
  return projectiles;
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

let initPack = { player: [], projectile: [] };
let removePack = { player: [], projectile: [] };

// every frame update the game state and empty arrays to avoid duplication
setInterval(() => {
  let pack = {
    player: Player.update(),
    projectile: Projectile.update(),
  };

  for (let i in SOCKET_LIST) {
    let socket = SOCKET_LIST[i];
    socket.emit('init', initPack);
    socket.emit('update', pack);
    socket.emit('remove', removePack);
  }
  initPack.player = [];
  initPack.projectile = [];
  removePack.player = [];
  removePack.projectile = [];
}, 40);
