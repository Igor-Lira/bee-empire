import World from "@entities/World";

export class WorldPlayerController {

  world: World;
  constructor(world: World) {
    this.world = world;
  }
}

export default WorldPlayerController;
