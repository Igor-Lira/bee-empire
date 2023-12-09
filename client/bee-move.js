let isDragging = false;
let startMouseX, startMouseY;

document.addEventListener('mousedown', (event) => {
  if (event.button !== 0) return;
  isDragging = true;
  startMouseX = event.clientX;
  startMouseY = event.clientY;
  selectionBox.style.display = 'block';
  selectionBox.style.left = startMouseX + 'px';
  selectionBox.style.top = startMouseY + 'px';
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
});

document.addEventListener('mousemove', (e) => {
  isMouseover = true;
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  if (!isDragging) return;
  let boxWidth = cursor.x - startMouseX;
  let boxHeight = cursor.y - startMouseY;
  selectionBox.style.width = Math.abs(boxWidth) + 'px';
  selectionBox.style.height = Math.abs(boxHeight) + 'px';
  if (boxWidth < 0) {
    selectionBox.style.left = cursor.x  + 'px';
  }

  if (boxHeight < 0) {
    selectionBox.style.top = cursor.y + 'px';
  }

  const isInside = isPointInsideSelectionBox(
    objects[0].x,
    objects[0].y,
    selectionBox.offsetLeft,
    selectionBox.offsetTop,
    Math.abs(boxWidth),
    Math.abs(boxHeight),
  );
  if (isInside) {
    objects[0].selected = true;
    objects[0].focused = true;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  isMouseover = false;
  if (objects[0].focused) {
    objects[0].focused = false;
  } else {
    objects[0].selected = false;
  }
  selectionBox.style.display = 'none';
});


function handleRightClick(event) {
  event.preventDefault(); // Prevent default right-click menu
  const myDiv = document.createElement("div");
  myDiv.classList.add('right-click-animation');
  myDiv.style.left = event.pageX - 20 + 'px';
  myDiv.style.top = event.pageY - 20 + 'px';

  if (objects[0].selected) {
    objects[0].focused = true;
    if(objects[0].movement) {
      clearInterval(objects[0].movement);
    }
    move(event.pageX, event.pageY);
  }

  const right = document.getElementById("right-click");
  right.appendChild(myDiv);
  setTimeout(() => {
    myDiv.remove();
  }, 1000); // Change 1000 to the desired duration of the animation in milliseconds
}


function move(mouseX, mouseY) {
  const targetX = mouseX - objects[0].x;
  const targetY = mouseY - objects[0].y;
  const deg = Math.atan2(targetY, targetX);
  const dist = Math.hypot(targetX, targetY);
  const deltaX = 0.8 * Math.cos(deg);
  const deltaY = 0.8 * Math.sin(deg);
  if (!isNaN(deltaX)) {
    objects[0].x += deltaX;
  }
  if (!isNaN(deltaY)) {
    objects[0].y += deltaY;
  }
  if (dist > 1) {
    objects[0].movement = setTimeout(() => {
      move(mouseX, mouseY);
    }, 10)
  }
}
// Listen for the contextmenu event (right-click) on the div
document.body.addEventListener('contextmenu', handleRightClick);
document.body.addEventListener('click', () => {
    // for(let i=0;i<objects.length;i=i+1) {
    //   objects[i].selected = false;
    // }
})
