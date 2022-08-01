/* eslint-disable*/
import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import TUNDRA from '../img/map.png';
import PALACE from '../img/map3.png';
import SNOWBALL from '../img/snowball.png';
import PENGUIN from '../img/penguin.png';
import POLARBEAR from '../img/polar-bear.png';
import SEAL from '../img/seal.png'
import Chat from '../components/Chat/Chat'
import Auth from '../utils/auth'
// import Player from '../classes/Player';
// import Projectile from '../classes/Projectile';
import { ChoiceContext } from '../utils/Context';

// Import the `useParams()` hook
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

const Game = ({socket}) => {
  //canvas stuff
  const canvasRef = useRef(null);
  const uiRef = useRef(null);
  const changeMap = ()=>{
    socket.emit('changeMap');
  };
  
  let displayName = Auth.getProfile().data.displayName;

  const { userChoice, setUserChoice } = useContext(ChoiceContext);

  useEffect(() => {
    // console.log('Rendering image');
    if (canvasRef.current && uiRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const ctxUi = uiRef.current.getContext('2d');
      ctxUi.font = '30px Arial';
      const Img= {};
      Img.player = {};
      Img.player['penguin'] = new Image();
      Img.player['penguin'].src = PENGUIN;
      Img.player['polarBear'] = new Image();
      Img.player['polarBear'].src = POLARBEAR;
      Img.player['seal'] = new Image();
      Img.player['seal'].src = SEAL;
      Img.projectile = new Image();
      Img.projectile.src = SNOWBALL;
      Img.map = {};
      Img.map['tundra'] = new Image();
      Img.map['tundra'].src = TUNDRA;
      Img.map['palace'] = new Image();
      Img.map['palace'].src = PALACE;


      class Player {
        constructor(initPack) {
        let self = {};
        self.id = initPack.id;
        self.number = initPack.number;
        self.displayName = displayName;
        self.x = initPack.x;
        self.y = initPack.y;
        self.hp = initPack.hp;
        self.hpMax = initPack.hpMax;
        self.level = initPack.level;
        self.ultimate = initPack.ultimate;
        self.map = initPack.map;
         // draws our characters, their hp bars and their levels.
        self.draw = ()=> {
            if(Player.list[selfId].map !== self.map) {
                return;
            }
            let x= self.x - Player.list[selfId].x + 250;
            let y = self.y - Player.list[selfId].y + 250;

            let width = Img.player[userChoice].width/16;
            let height = Img.player[userChoice].height/16;

            let hpWidth = 30 * self.hp / self.hpMax;
            ctx.fillStyle = 'red';
            ctx.fillRect(x - hpWidth/2, y - 40, hpWidth, 4);
            // setting parameters for how to use the player images to render our user's sprites

            ctx.drawImage(Img.player[userChoice],
            0, 0, Img.player[userChoice].width, Img.player[userChoice].height,
            x-width/2, y-height/2, width, height);
        }
        Player.list[self.id] = self;
        return self;
    }
    }

    Player.list = {};

    // initializes a Projectile using a package sent from server, contains all the data for client side

    class Projectile {
        constructor(initPack) {
        let self = {};
        self.id = initPack.id;
        self.x = initPack.x;
        self.y = initPack.y;
        self.map = initPack.map;

        self.draw = ()=> {
            if(Player.list[selfId].map !== self.map) {
                return;
            }
            let width = Img.projectile.width/8;
            let height = Img.projectile.height/8;

            let x= self.x - Player.list[selfId].x + 250;
            let y = self.y - Player.list[selfId].y + 250;

            ctx.drawImage(Img.projectile,
            0, 0, Img.projectile.width, Img.projectile.height, x-width/2, y-height/2, width, height);
        }
        Projectile.list[self.id] = self;
        return self;
    }
    }

    Projectile.list = {};

    // creates a new player and projectile and adds them to the player and projectile list
    // expect: {player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], projectile:[]}
    let selfId = null;

    socket.on('init', (data)=> {
        if(data.selfId) {
            selfId = data.selfId;
        }
        for(let i = 0 ; i < data.player.length; i++) {
            new Player (data.player[i]);
        }
        for(let i= 0; i < data.projectile.length; i++) {
            new Projectile(data.projectile[i]);
        }
    })

    //update

    // loops through player and projectile lists, checks if defined, then updates values.
    // if pack is undefined then there's no new information to update or a desync has occurred.
    // expect: {player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}], projectile:[]}
    socket.on('update', (data)=> {
        for(let i = 0; i <data.player.length; i++) {
            let pack = data.player[i];
            let p = Player.list[pack.id];
            if(p) {
                if(pack.x !== undefined) {
                    p.x = pack.x;
                }
                if(pack.y !== undefined) {
                    p.y = pack.y;
                }
                if(pack.hp !== undefined) {
                    p.hp = pack.hp;
                }
                if(pack.level !== undefined) {
                    p.level = pack.level;
                }
                if(pack.map !== undefined) {
                    p.map = pack.map;
                }
                if(pack.ultimate !== undefined) {
                  p.ultimate = pack.ultimate;
                }
            }
        }
        for (let i = 0; i < data.projectile.length; i++) {
            let pack = data.projectile[i];
            let b = Projectile.list[data.projectile[i].id];
            if(b) {
                if(pack.x !== undefined) {
                    b.x = pack.x;
                }
                if (pack.y !== undefined) {
                    b.y = pack.y;
                }
            }
        }
    })

    //remove

    // expect: {player : [12323], projectile:[12323,123123]}
    socket.on('remove', (data)=> {
        for(let i = 0; i < data.player.length; i++) {
            delete Player.list[data.player[i]];
        }
        for(let i = 0; i < data.projectile.length; i++) {
            delete Projectile.list[data.projectile[i]];
        }
    });

    // Positional awareness

    // Loop through the players and projectile lists and draw them on the canvas.
    setInterval(()=> {
        if(!selfId) {
            return
        };
        ctx.clearRect(0,0,500,500);
        drawMap();
        drawLevel();
        for(let i in Player.list) {
            Player.list[i].draw();
            // console.log('Hope this works, expecting <insertUserDisplayName>: ', Player.list[i].displayName)
        }
        for(let i in Projectile.list) {
            Projectile.list[i].draw();
        }
    }, 80);

    let drawMap = ()=> {
        let player = Player.list[selfId];
        let x = 250 - player.x;
        let y = 250 - player.y;
        ctx.drawImage(Img.map[player.map], x, y);
    }

    let drawLevel = ()=> {
        if(lastLevel === Player.list[selfId].level) {
            return;
        }
        lastLevel = Player.list[selfId].level;
        ctxUi.clearRect( 0, 0, 500, 500);
        ctxUi.fillStyle = 'black';
        ctxUi.fillText(Player.list[selfId].level,0,30);
    }

    let lastLevel = null;

    document.onkeydown = (event) => {
      if (event.key === 'd') {
        // console.log('pushing d');
        socket.emit('keyPress', { inputId: 'right', state: true });
      } else if (event.key === 's') {
        // console.log('pushing s');
        socket.emit('keyPress', { inputId: 'down', state: true });
      } else if (event.key === 'a') {
        // console.log('pushing a');
        socket.emit('keyPress', { inputId: 'left', state: true });
      } else if (event.key === 'w') {
        // console.log('pushing w');
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

    // document.onkeydown = (event) => {
    //   if (event.key === 'q') {
    //     socket.emit('useUltimate', Player.list[selfId]);
    //     console.log(Player.list[selfId]);
    //   }
    // }
  
    document.onmousedown = (event) => {
      // console.log('pushing attack');
      socket.emit('keyPress', { inputId: 'attack', state: true });
    };
    document.onmouseup = (event) => {
      socket.emit('keyPress', { inputId: 'attack', state: false });
    };
    document.onmousemove = (event) => {
      // find relative to center of the canvas
      let x = -250 + event.clientX - 200;
      let y = -250 + event.clientY - 100;
      // find the angle by extracting the y and the x using atan2
      let angle = Math.atan2(y, x) / Math.PI * 180;
      socket.emit('keyPress', { inputId: 'mouseAngle', state: angle });
    };
  }
  console.log('User chose: ', userChoice);
  console.log('useEffect in motion');
  socket.emit('clientReady');
  return ()=> {
    console.log('useEffect cleanup in process');
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    document.onkeyup = null;
    document.onkeydown = null;
  }
  }, [socket]);

  // console.log(displayName);

  const useUltimate = () => {
    socket.emit('useUltimate', Player.list[selfId]);
    console.log('Player.list[selfId] is: ', Player.list[selfId])
  }

  console.log('rendering- react leave me alone');
  return useMemo(()=>(
    <div id="gameDiv">
      <div
        id="game"
        style={{position: "absolute", top: "100px", left: "200px", width: "500px", height: "500px"}}>
        <canvas
          id="gameCanvas"
          ref={canvasRef}
          width= "500"
          height= "500"
          style={{ position: "absolute", border: "1px solid #000000" }}></canvas>
        <canvas
          id="uiCanvas"
          ref={uiRef}
          width= "500"
          height= "500"
          style={{ position: "absolute", border: "1px solid #000000" }}></canvas>
      </div>

      <div id="ui">
        <button className="map__btn" onClick={changeMap} style={{ bottom: "-20px", left: "0px"}}>
          Change Map
        </button>
        {/* <button onClick={useUltimate}>Ultimate</button> */}
      </div>

      <div id= "chat">
        <p> VIVA LA REVOLUCION!</p>
        <Chat socket={ socket } displayName={ displayName }/>
      </div>
    </div>
  ), []);
};

export default Game;
