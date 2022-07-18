/* eslint-disable no-undef */
Inventory = (socket, server) => {
  let self = {
    items: [],
    socket: socket,
    server: server,
  };
  self.addItem = (id, amount) => {
    for (let i = 0; i < self.items.length; i++) {
      if (self.items[i].id === id) {
        self.items[i].amount += amount;
        self.refreshRender();
        return;
      }
    }
    self.items.push({ id: id, amount: amount });
    self.refreshRender();
  };
  self.removeItem = (id, amount) => {
    for (let i = 0; i < self.items.length; i++) {
      if (self.items[i].id === id) {
        self.items[i].amount -= amount;
        if (self.items[i].amount <= 0) {
          self.items.splice(i, 1);
          self.refreshRender();
          return;
        }
      }
    }
  };
  self.hasItem = (id, amount) => {
    for (let i = 0; i < self.items.length; i++) {
      if (self.items[i].id === id) {
        return self.items[i].amount >= amount;
      }
    }
    return false;
  };
  self.refreshRender = () => {
    // Server side
    if (self.server) {
      self.socket.emit('updateInventory', self.items);
      return;
    }

    // Client side
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';
    const addButton = (data) => {
      let item = Item.list[data.id];
      let button = document.createElement('button');
      button.onclick = () => {
        self.socket.emit('useItem', item.id);
      };
      button.innerText = item.name + ' x' + data.amount;
      inventory.appendChild(button);
    };
    for (let i = 0; i < self.items.length; i++) {
      addButton(self.items[i]);
    }
    if (self.server) {
      self.socket.on('useItem', (itemId) => {
        if (!self.hasItem(itemId, 1)) {
          console.log('Cheater');
          return;
        }
        let item = Item.list[itemId];
        item.event(Player.list[self.socket.id]);
      });
    }

    return self;
  };
};

Item = (id, name, event) => {
  let self = {
    id: id,
    name: name,
    event: event,
  };

  Item.list[self.id] = self;
  return self;
};

Item.list = {};

Item('cuppa', 'Cuppa', (player) => {
  player.hp = 30;
  player.inventory.removeItem('cuppa', 1);
  player.inventory.addItem('ultimateAbility', 1);
});

Item('ultimateAbility', 'Ultimate Ability', (player) => {
  for (let i = 0; i < 360; i++) {
    player.shootProjectile(i);
  }
});

module.exports = { Inventory, Item };
