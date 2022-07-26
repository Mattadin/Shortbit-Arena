// import Player from './Player';

// import TUNDRA from '../img/map.png';
// import PALACE from '../img/map2.png';
// import SNOWBALL from '../img/snowball.png';
// import PENGUIN from '../img/penguin.png';

// const WIDTH = 500;
// const HEIGHT = 500;

// const Img = {};
// Img.player = new Image();
// Img.player.src = PENGUIN;
// Img.projectile = new Image();
// Img.projectile.src = SNOWBALL;
// Img.map = {};
// Img.map['tundra'] = new Image();
// Img.map['tundra'].src = TUNDRA;
// Img.map['palace'] = new Image();
// Img.map['palace'].src = PALACE;

// class Projectile {
//   constructor(initPack) {
//     let self = {};
//     self.id = initPack.id;
//     self.x = initPack.x;
//     self.y = initPack.y;
//     self.map = initPack.map;

//     self.draw = () => {
//       if (Player.list[selfId].map !== self.map) {
//         return;
//       }
//       let width = Img.projectile.width / 8;
//       let height = Img.projectile.height / 8;

//       let x = self.x - Player.list[selfId].x + WIDTH / 2;
//       let y = self.y - Player.list[selfId].y + HEIGHT / 2;

//       ctx.drawImage(
//         Img.projectile,
//         0,
//         0,
//         Img.projectile.width,
//         Img.projectile.height,
//         x - width / 2,
//         y - height / 2,
//         width,
//         height
//       );
//     };
//     Projectile.list[self.id] = self;
//     return self;
//   }
// }

// Player.list = {};

// let selfId = null;

// export default Projectile;
