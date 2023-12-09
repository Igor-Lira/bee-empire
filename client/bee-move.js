let isDragging = false;
let startMouseX, startMouseY;
let selectionBox = document.getElementById('selection-box');

function isPointInsideSelectionBox(x, y, boxX, boxY, boxWidth, boxHeight) {
  return x >= boxX && x <= boxX + boxWidth && y >= boxY && y <= boxY + boxHeight;
}

document.addEventListener('mousedown', (event) => {
  if (event.button !== 0) return; // Check for left mouse button (button 0)
  isDragging = true;
  startMouseX = event.clientX;
  startMouseY = event.clientY;
  selectionBox.style.display = 'block';
  selectionBox.style.left = startMouseX + 'px';
  selectionBox.style.top = startMouseY + 'px';
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
});

document.addEventListener('mousemove', (event) => {
  if (!isDragging) return;
  let currentMouseX = event.clientX;
  let currentMouseY = event.clientY;

  let boxWidth = currentMouseX - startMouseX;
  let boxHeight = currentMouseY - startMouseY;

  selectionBox.style.width = Math.abs(boxWidth) + 'px';
  selectionBox.style.height = Math.abs(boxHeight) + 'px';

  if (boxWidth < 0) {
    selectionBox.style.left = currentMouseX + 'px';
  }

  if (boxHeight < 0) {
    selectionBox.style.top = currentMouseY + 'px';
  }

  const element = document.getElementById('selection-box');

  const top = element.offsetTop;
  const left = element.offsetLeft;

  const isInside = isPointInsideSelectionBox(global.player.bee.x, global.player.bee.y,top, left,boxWidth, boxHeight);
  if (isInside) {
    console.log('called');
    window.requestAnimationFrame(() => drawBee(global.player.bee.x, global.player.bee.y, 20, true));
  }

});

document.addEventListener('mouseup', () => {
  isDragging = false;
  selectionBox.style.display = 'none';
});


function handleRightClick(event) {
  event.preventDefault(); // Prevent default right-click menu
  const myDiv = document.createElement("div");
  myDiv.classList.add('right-click-animation');
  myDiv.style.left = event.pageX - 20 + 'px';
  myDiv.style.top = event.pageY - 20 + 'px';
  move(global.player.bee.x, global.player.bee.y, event.pageX, event.pageY);
  const right = document.getElementById("right-click");
  right.appendChild(myDiv);
  setTimeout(() => {
    myDiv.remove();
  }, 1000); // Change 1000 to the desired duration of the animation in milliseconds
}


function move(beeX, beeY, mouseX, mouseY) {
  const targetX = mouseX - beeX;
  const targetY = mouseY - beeY;
  const deg = Math.atan2(targetY, targetX);
  const dist = Math.hypot(targetX, targetY);
  const deltaX = 10 * Math.cos(deg);
  const deltaY = 10 * Math.sin(deg);
  let newX = beeX;
  let newY = beeY;
  if (!isNaN(deltaX)) {
    newX += deltaX;
  }
  if (!isNaN(deltaY)) {
    newY += deltaY;
  }
  drawBee(newX, newY, 20);
  console.log(dist);
  if (dist > 5) {
    setTimeout(() => {
      move(newX, newY, mouseX, mouseY);
    }, 200)
  }
}
// Listen for the contextmenu event (right-click) on the div
document.body.addEventListener('contextmenu', handleRightClick);
