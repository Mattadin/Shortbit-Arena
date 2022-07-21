import { Img } from './Img';

const WIDTH = 500;
const HEIGHT = 500;

class Player {
  constructor(initPack) {
    let self = {};
    self.id = initPack.id;
    self.number = initPack.number;
    self.x = initPack.x;
    self.y = initPack.y;
    self.hp = initPack.hp;
    self.hpMax = initPack.hpMax;
    self.level = initPack.level;
    self.map = initPack.map;
    // draws our characters and their hp bars
    self.draw = (ctx) => {
      if (Player.list[selfId].map !== self.map) {
        return;
      }
      let x = self.x - Player.list[selfId].x + WIDTH / 2;
      let y = self.y - Player.list[selfId].y + HEIGHT / 2;

      let width = Img.player.width / 16;
      let height = Img.player.height / 16;

      let hpWidth = (30 * self.hp) / self.hpMax;
      ctx.fillStyle = 'red';
      ctx.fillRect(x - hpWidth / 2, y - 40, hpWidth, 4);
      // setting parameters for how to use the player images to render our user's sprites

      ctx.drawImage(
        Img.player,
        0,
        0,
        Img.player.width,
        Img.player.height,
        x - width / 2,
        y - height / 2,
        width,
        height
      );
    };
    Player.list[self.id] = self;
    return self;
  }
}

let selfId = null;

export { Player };
