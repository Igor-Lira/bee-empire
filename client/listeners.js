document.addEventListener("mousedown", world.controller.onMouseClick.bind(world.controller));

document.addEventListener("mousemove", world.controller.onMouseMove.bind(world.controller));

document.addEventListener("mouseup", world.controller.onMouseUp.bind(world.controller));

document.body.addEventListener("contextmenu", world.controller.onMouseRightClick.bind(world.controller));
