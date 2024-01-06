import Player from "@entities/Player";

export enum WallType {
  /**
   * L1 is the bottom line of a hexagon
   */
  L1 = 'L1',
  /**
   * L2 is the right side of L1
   */
  L2 = 'L2',
  /**
   * L3 is the vertical line side of L2
   */
  L3 = 'L3',
  /**
   * The other lines are defined clock-wide:
   */
  L4 = 'L4',
  L5 = 'L5',
  L6 = 'L6',
}


export interface FightEntity {
  player: Player | null;
  attacking: number;
  score: number;
}
