import Player from "@entities/Player";
import Wall from "@entities/Wall";
import {FightEntity} from "@typing/wall";

class FightController {
  HEALTH = 100;
  wall: Wall;
  /** attacking = number of bees attacking the wall **/
  /** score = number of accumulated attacked **/
  entity1: FightEntity = { player: null, score: 0, attacking: 0};
  entity2: FightEntity = { player: null, score: 0, attacking: 0};

  constructor(wall: Wall) {
    this.wall = wall;
  }

  compute() {
    if (this.wall.isExternalBorder) { return; }
    if (this.wall.hexagon.isOnSafety || this.wall.enemyWall?.hexagon.isOnSafety ) { return; }
    if (this.wall.collisionsWithMask.length > 0) {

      this.entity1.attacking = 0;
      this.entity2.attacking = 0;


      if (this.wall.owner && (this.entity1.player?.id !== this.wall.owner?.id)) {
        this.entity1.player = this.wall.owner;
        this.entity1.attacking = 0;
        this.entity1.score = 0;
      }

      if (this.wall.enemyHexagon?.owner && (this.entity2.player?.id !== this.wall.enemyHexagon?.owner.id)) {
        this.entity2.player = this.wall.enemyHexagon?.owner;
        this.entity2.attacking = 0;
        this.entity2.score = 0;
      }


      for (let collision of this.wall.collisionsWithMask) {
        const bee = this.wall.world.bees[collision];
        if (bee.player.id === this.entity1?.player?.id) {
          this.entity1.attacking++;
        }
        if (bee.player.id === this.entity2?.player?.id) {
          this.entity2.attacking++;
        }
      }

      if (
          (this.entity1.attacking > 0 && (this.wall.owner?.id !== this.entity1.player?.id || this.wall.enemyWall?.owner?.id !== this.entity1.player?.id)) ||
          (this.entity2.attacking > 0 && (this.wall.owner?.id !== this.entity2.player?.id || this.wall.enemyWall?.owner?.id !== this.entity2.player?.id))
      ) {
        this.wall.isOnFight = true;
      } else {
        this.wall.isOnFight = true;
        this.entity1.score = 0;
        this.entity2.score= 0;
      }

      const diff = this.entity1.attacking - this.entity2.attacking;
      const absolute = Math.abs(diff);

      if (diff > 0) {
        if (this.entity1.score < this.HEALTH) {
          this.entity1.score+=absolute;
        }
        if (this.entity2.score > 0) {
          this.entity2.score-=absolute;
        }
      } else {
        if (this.entity1.score > 0) {
          this.entity1.score-=absolute;
        }
        if (this.entity2.score < this.HEALTH) {
          this.entity2.score+=absolute;
        }
      }
      if (this.entity1.score > this.HEALTH - 1) {
        if (this.wall.owner && this.wall.enemyHexagon) {
          this.wall.enemyHexagon.conquer(this.wall.owner);
        }
      }

      if (this.entity2.score > this.HEALTH - 1) {
        if (this.wall.owner && this.wall.enemyHexagon?.owner) {
          this.wall.hexagon.conquer(this.wall.enemyHexagon.owner);
        }
      }

    } else {
      this.wall.isOnFight = false;
    }
  }
}

export default FightController;
