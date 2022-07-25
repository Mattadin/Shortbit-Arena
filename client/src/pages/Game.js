import React, { useState, useRef, useEffect } from 'react';
import TUNDRA from '../img/map.png';
import PALACE from '../img/map2.png';
import SNOWBALL from '../img/snowball.png';
import PENGUIN from '../img/penguin.png';
import Player from '../classes/Player';
import Projectile from '../classes/Projectile';

// Import the `useParams()` hook
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { Inventory, Item } from '../Inventory';

import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

const Game = () => {
  const Img = {};
  Img.player = new Image();
  Img.player.src = PENGUIN;
  Img.projectile = new Image();
  Img.projectile.src = SNOWBALL;
  Img.map = {};
  Img.map['tundra'] = new Image();
  Img.map['tundra'].src = TUNDRA;
  Img.map['palace'] = new Image();
  Img.map['palace'].src = PALACE;

  const WIDTH = 500;
  const HEIGHT = 500;
  const socket = io();

  // Img.map['palace'] = new Image();
  // Img.map['palace'].src = { PALACE };

  // chat/canvas stuff
  const chatText = useRef();
  const chatInput = useRef();
  const chatForm = useRef();
  const canvasRef = useRef(null);
  const uiRef = useRef(null);
  // ctxUi.font = '30px Arial';

  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = TUNDRA;

    img.onload = () => setImage(img);
  }, []);

  useEffect(() => {
    console.log({ image, canvasRef });
    if (image && canvasRef) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 500, 500);
      ctx.drawImage(image, 0, 0, 500, 500);
    }
  }, [image, canvasRef]);

  socket.on('addToChat', (data) => {
    chatText.innerHTML += '<div>' + data + '</div>';
  });

  // socket.on('evalAnswer', (data) => {
  //   console.log(data);
  // });

  // chatForm.onsubmit = (e) => {
  //   e.preventDefault();
  //   if (chatInput.value[0] === '/') {
  //     socket.emit('evalServer', chatInput.values.slice(1));
  //   } else if (chatInput.value[0] === '@') {
  //     // Chat syntax: @username, message
  //     socket.emit('sendPmToServer', {
  //       userName: chatInput.value.slice(1, chatInput.value.indexOf(',')),
  //       message: chatInput.value.slice(chatInput.value.indexOf(',') + 1),
  //     });
  //   } else {
  //     socket.emit('sendMsgToServer', chatInput.value);
  //   }
  //   chatInput.value = '';
  // };

  // UI Functions

  const changeMap = () => {
    socket.emit('changeMap');
  };

  let inventory = new Inventory(socket, false);
  socket.on('updateInventory', (items) => {
    inventory.items = items;
    inventory.refreshRender();
  });

  // game stuff

  // init

  // initializes a player using a package sent from server, contains all the data for client side

  Player.list = {};

  // initializes a Projectile using a package sent from server, contains all the data for client side

  Projectile.list = {};

  // creates a new player and projectile and adds them to the player and projectile list
  // expect: {player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], projectile:[]}
  let selfId = null;

  socket.on('init', (data) => {
    if (data.selfId) {
      selfId = data.selfId;
    }
    for (let i = 0; i < data.player.length; i++) {
      new Player(data.player[i]);
    }
    for (let i = 0; i < data.projectile.length; i++) {
      new Projectile(data.projectile[i]);
    }
  });

  //update

  // loops through player and projectile lists, checks if defined, then updates values.
  // if pack is undefined then there's no new information to update or a desync has occurred.
  // expect: {player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], projectile:[]}
  socket.on('update', (data) => {
    for (let i = 0; i < data.player.length; i++) {
      let pack = data.player[i];
      let p = Player.list[pack.id];
      if (p) {
        if (pack.x !== undefined) {
          p.x = pack.x;
        }
        if (pack.y !== undefined) {
          p.y = pack.y;
        }
        if (pack.hp !== undefined) {
          p.hp = pack.hp;
        }
        if (pack.level !== undefined) {
          p.level = pack.level;
        }
        if (pack.map !== undefined) {
          p.map = pack.map;
        }
      }
    }
    for (let i = 0; i < data.projectile.length; i++) {
      let pack = data.projectile[i];
      let b = Projectile.list[data.projectile[i].id];
      if (b) {
        if (pack.x !== undefined) {
          b.x = pack.x;
        }
        if (pack.y !== undefined) {
          b.y = pack.y;
        }
      }
    }
  });

  //remove

  // Loops through the player list and projectile list and removes things designated for destruction.
  // expect: {player : [12323], projectile:[12323,123123]}
  socket.on('remove', (data) => {
    for (let i = 0; i < data.player.length; i++) {
      delete Player.list[data.player[i]];
    }
    for (let i = 0; i < data.projectile.length; i++) {
      delete Projectile.list[data.projectile[i]];
    }
  });

  // Positional awareness

  // Loop through the players and projectile lists and draw them on the canvas 25 times per second.
  setInterval((ctx, ctxUi) => {
    if (!selfId) {
      return;
    }
    drawMap(ctx);
    drawLevel(ctxUi);
    for (let i in Player.list) {
      Player.list[i].draw();
    }
    for (let i in Projectile.list) {
      Projectile.list[i].draw();
    }
  }, 40);

  let drawMap = (ctx) => {
    let player = Player.list[selfId];
    let x = WIDTH / 2 - player.x;
    let y = HEIGHT / 2 - player.y;
    ctx.drawImage(Img.map[player.map], x, y);
  };

  let drawLevel = (ctxUi) => {
    if (lastLevel === Player.list[selfId].level) {
      return;
    }
    lastLevel = Player.list[selfId].level;
    ctxUi.clearRect(0, 0, 500, 500);
    ctxUi.fillStyle = 'black';
    ctxUi.fillText(Player.list[selfId].level, 0, 30);
  };
  let lastLevel = null;

  document.onkeydown = (event) => {
    if (event.key === 'd') {
      socket.emit('keyPress', { inputId: 'right', state: true });
    } else if (event.key === 's') {
      socket.emit('keyPress', { inputId: 'down', state: true });
    } else if (event.key === 'a') {
      socket.emit('keyPress', { inputId: 'left', state: true });
    } else if (event.key === 'w') {
      socket.emit('keyPress', { inputId: 'up', state: true });
    }
  };

  document.onkeyup = (event) => {
    if (event.key === 'd') {
      socket.emit('keyPress', { inputId: 'right', state: false });
    } else if (event.key === 's') {
      socket.emit('keyPress', { inputId: 'down', state: false });
    } else if (event.key === 'a') {
      socket.emit('keyPress', { inputId: 'left', state: false });
    } else if (event.key === 'w') {
      socket.emit('keyPress', { inputId: 'up', state: false });
    }
  };

  document.onmousedown = (event) => {
    socket.emit('keyPress', { inputId: 'attack', state: true });
  };
  document.onmouseup = (event) => {
    socket.emit('keyPress', { inputId: 'attack', state: false });
  };
  document.onmousemove = (event) => {
    // find relative to center of the canvas
    let x = -250 + event.clientX - 8;
    let y = -250 + event.clientY - 8;
    // find the angle by extracting the y and the x using atan2
    let angle = (Math.atan2(y, x) / Math.PI) * 180;
    socket.emit('keyPress', { inputId: 'mouseAngle', state: angle });
  };

  // document.oncontextmenu = (event) => {
  //   event.preventDefault();
  // };

  return (
    <div id="gameDiv">
      <div
        id="game"
        // style="position: absolute; top: 8px; left: 8px; width:500px; height:500px"
      >
        <canvas ref={canvasRef}></canvas>
        <canvas ref={uiRef}></canvas>

        <div id="ui">
          <button>Change Map</button>
        </div>
      </div>

      <div id="belowGame">
        <div ref={chatText}>
          <div>Welcome to the game!</div>
        </div>
        <div id="inventory"></div>

        <form ref={chatForm}>
          <input ref={chatText} type="text"></input>
        </form>
      </div>
    </div>
  );
};

export default Game;
