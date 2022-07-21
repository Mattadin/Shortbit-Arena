import { Img } from './Img';
import { Player } from './Player';

const WIDTH = 500;
const HEIGHT = 500;

class Projectile {
  constructor(initPack) {
    let self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;
    self.map = initPack.map;

    self.draw = (ctx) => {
      if (Player.list[selfId].map !== self.map) {
        return;
      }
      let width = Img.projectile.width / 8;
      let height = Img.projectile.height / 8;

      let x = self.x - Player.list[selfId].x + WIDTH / 2;
      let y = self.y - Player.list[selfId].y + HEIGHT / 2;

      ctx.drawImage(
        Img.projectile,
        0,
        0,
        Img.projectile.width,
        Img.projectile.height,
        x - width / 2,
        y - height / 2,
        width,
        height
      );
    };
    Projectile.list[self.id] = self;
    return self;
  }
}

let selfId = null;

export { Projectile };
