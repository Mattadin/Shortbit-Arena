const { Inventory } = require('../client/src/Inventory');

let initPack = { player: [], projectile: [] };
let removePack = { player: [], projectile: [] };
Entity = (param) => {
  let self = {
    x: 250,
    y: 250,
    spdX: 0,
    spdY: 0,
    id: '',
    map: 'map',
  };
  if (param) {
    if (param.x) {
      self.x = param.x;
    }
    if (param.y) {
      self.y = param.y;
    }
    if (param.map) {
      self.map = param.map;
    }
    if (param.id) {
      self.id = param.id;
    }
  }
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

// Function that contains our initialization, removal, and update packets- resets the arrays and returns the updated info
Entity.getFrameUpdateData = () => {
  let pack = {
    initPack: {
      player: initPack.player,
      projectile: initPack.projectile,
    },
    removePack: {
      player: removePack.player,
      projectile: removePack.projectile,
    },
    updatePack: {
      player: Player.update(),
      projectile: Projectile.update(),
    },
  };
  initPack.player = [];
  initPack.projectile = [];
  removePack.player = [];
  removePack.projectile = [];
  return pack;
};

Player = (param) => {
  let self = Entity(param);
  self.number = '' + Math.floor(10 * Math.random());
  self.userName = '';
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
  self.inventory = new Inventory(param.socket, true);

  let super_update = self.update;
  self.update = () => {
    self.updateSpd();
    super_update();

    if (self.pressingAttack) {
      self.shootProjectile(self.mouseAngle);
    }
  };
  self.shootProjectile = (angle) => {
    if (Math.random() < 0.0001) {
      self.inventory.addItem('cuppa', 1);
    }
    Projectile({
      shooter: self.id,
      angle: angle,
      x: self.x,
      y: self.y,
      map: self.map,
    });
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
      map: self.map,
    };
  };

  self.getUpdatePack = () => {
    return {
      id: self.id,
      x: self.x,
      y: self.y,
      hp: self.hp,
      level: self.level,
      map: self.map,
    };
  };

  Player.list[self.id] = self;

  initPack.player.push(self.getInitPack());
  return self;
};

Player.list = {};

Player.onConnect = (socket, userName) => {
  let map = 'tundra';
  if (Math.random() < 0.5) {
    map = 'palace';
  }
  let player = Player({
    userName: userName,
    id: socket.id,
    map: map,
    socket: socket,
  });
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

  socket.on('changeMap', (data) => {
    if (player.map === 'tundra') {
      player.map = 'palace';
    } else {
      player.map = 'tundra';
    }
  });
  // Data below is simply the message being sent to global chat.
  socket.on('sendMsgToServer', (data) => {
    for (let i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', player.userName + ': ' + data);
    }
    // socket.on('evalServer', (data) => {
    //   if (!DEBUG) {
    //     return;
    //   }
    //   const result = eval(data);
    //   socket.emit('evalAnswer', result);
    // });
  });
  console.log('socket connection');
  // Data below is going to be {userName, message}.
  socket.on('sendPmToServer', (data) => {
    let recipientSocket = null;
    for (let i in Player.list) {
      if (Player.list[i].userName === data.userName) {
        recipientSocket = SOCKET_LIST[i];
      } else if (recipientSocket === null) {
        recipientSocket.emit(
          'addToChat',
          'The player ' + data.userName + ' is not online or does not exist.'
        );
      } else {
        recipientSocket.emit(
          'addToChat',
          'From ' + data.userName + ': ' + data.message
        );
        socket.emit('addToChat', 'To ' + data.userName + ': ' + data.message);
      }
    }
    for (let i in SOCKET_LIST) {
      SOCKET_LIST[i].emit('addToChat', data.userName + ': ' + data);
    }
  });

  socket.emit('init', {
    selfId: socket.id,
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

Projectile = (param) => {
  let self = Entity(param);
  self.id = Math.random();
  self.angle = param.angle;
  self.spdX = Math.cos((param.angle / 180) * Math.PI) * 20;
  self.spdY = Math.sin((param.angle / 180) * Math.PI) * 20;
  self.shooter = param.shooter;

  self.timer = 0;
  self.toRemove = false;
  let super_update = self.update;
  self.update = function () {
    if (self.timer++ > 20) {
      self.toRemove = true;
    }
    super_update();

    for (let i in Player.list) {
      let p = Player.list[i];
      if (
        self.map === p.map &&
        self.getDistance(p) < 32 &&
        self.shooter !== p.id
      ) {
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
      map: self.map,
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

module.exports = { Entity, Player, Projectile };
