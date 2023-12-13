let isDragging = false;
let startMouseX, startMouseY;

document.addEventListener("mousedown", (event) => {
  if (event.button !== 0) return;
  isDragging = true;
  startMouseX = event.clientX;
  startMouseY = event.clientY;
  selectionBox.style.display = "block";
  selectionBox.style.left = startMouseX + "px";
  selectionBox.style.top = startMouseY + "px";
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";

  //On left click, should set selected false to all bees
  world.bees.map((bee) => (bee.selected = false));
});

document.addEventListener("mousemove", (e) => {
  isMouseover = true;
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  if (!isDragging) return;
  let boxWidth = cursor.x - startMouseX;
  let boxHeight = cursor.y - startMouseY;
  selectionBox.style.width = Math.abs(boxWidth) + "px";
  selectionBox.style.height = Math.abs(boxHeight) + "px";

  if (boxWidth < 0) {
    selectionBox.style.left = cursor.x + "px";
  }

  if (boxHeight < 0) {
    selectionBox.style.top = cursor.y + "px";
  }

  for (let beeId in world.bees) {
    world.bees[beeId].isInsideSelectionBox({
      offsetLeft: selectionBox.offsetLeft,
      offsetTop: selectionBox.offsetTop,
      width: Math.abs(boxWidth),
      height: Math.abs(boxHeight),
    });
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  isMouseover = false;
  selectionBox.style.display = "none";
});

function handleRightClick(event) {
  event.preventDefault(); // Prevent default right-click menu
  const myDiv = document.createElement("div");
  myDiv.classList.add("right-click-animation");
  myDiv.style.left = event.pageX - 20 + "px";
  myDiv.style.top = event.pageY - 20 + "px";
  const placeholderClick = document.getElementById("right-click");
  placeholderClick.appendChild(myDiv);
  for (let beeId in world.bees) {
    world.bees[beeId].onRightClick(event);
  }
}

document.body.addEventListener("contextmenu", handleRightClick);
