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
    objects[0].isMoving = true;
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
  if (!objects[0].isMoving) return;
  const targetX = mouseX - objects[0].x;
  const targetY = mouseY - objects[0].y;
  const deg = Math.atan2(targetY, targetX);
  const dist = Math.hypot(targetX, targetY);
  let deltaX = 0.8 * Math.cos(deg);
  let deltaY = 0.8 * Math.sin(deg);


  let wallCollision = false;
  for (let id in hexagons) {
    if (!hexagons[id].mine) {
      for (let line of hexagons[id].walls) {
        if (lineIntersectsRect({x: line.x1, y: line.y1}, {x: line.x2, y: line.y2}, objects[0])) {
          wallCollision = true;
        }
      }
    }
  }

  if (wallCollision) {
    deltaX = -10*deltaX;
    deltaY = -10*deltaY;
    objects[0].isMoving = false;
  }
  if (!wallCollision && objects.length > 1) {
    const intersect = getIntersection(objects[0], objects[1]);
    if (intersect) {
      // deltaX = intersection.pushX;
      // deltaY = intersection.pushY;
      if(intersect.pushX < intersect.pushY) {

        if(intersect.dirX < 0) {
          deltaX = - objects[1].width*0.2;
        } else if(intersect.dirX > 0) {
          deltaX = objects[1].width*0.2;
        }
      } else {

        if(intersect.dirY < 0) {
          deltaY = - objects[1].height*0.2;
        } else if(intersect.dirY > 0) {
          deltaY = + objects[1].height*0.2;
        }
      }
    }
  }

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

document.body.addEventListener('contextmenu', handleRightClick);
