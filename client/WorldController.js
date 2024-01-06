class WorldController {
  miniMap;
  isMiniMapFocused = false;
  isMouseOnMiniMap = false;
  outerBorders;
  isMouseInOuterBorder = false;
  isDragging = false;
  startMouseX;
  startMouseY;
  boxWidth;
  boxHeight;

  constructor() {
    this.miniMapSetup();
    this.outerBorders = document.getElementById('outer-borders');
  }

  miniMapSetup() {
    this.miniMap = document.getElementById('mini-map');
    this.miniMap.addEventListener('click', event => {
      this.isMiniMapFocused = true;
    });
    this.miniMap.addEventListener('mousemove', event => {
      if (this.isMouseOnMiniMap && this.isMiniMapFocused) {
        const leftRef = (event.pageX - this.miniMap.offsetLeft)/this.miniMap.offsetWidth;
        const topRef = (event.pageY - this.miniMap.offsetTop)/this.miniMap.offsetHeight;
        if (!isNaN(leftRef) && !isNaN(topRef)) {
          xOffset = MAX_OFFSET_X_SUP + leftRef * MAX_OFFSET_X_INF;
          yOffset = MAX_OFFSET_Y_SUP + topRef * MAX_OFFSET_Y_INF;
        }
      }
    })
  }

  onMouseMove(event) {
    isMouseover = true;
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    this.checkForScroll(event);
    this.checkIfMouseIsOnMinimap(event);
    this.updateSelectionBox();
    this.lookForEntitiesInsideSelectionBox();
  }

  onMouseUp(event) {
    this.isDragging = false;
    isMouseover = false;
    selectionBox.style.display = "none";
  }

  onMouseClick() {
    this.isMiniMapFocused = this.isMouseOnMiniMap;
    if (event.button !== 0) return;
    this.isDragging = true;
    this.startMouseX = event.clientX;
    this.startMouseY = event.clientY;
    selectionBox.style.display = "block";
    selectionBox.style.left = this.startMouseX + "px";
    selectionBox.style.top = this.startMouseY + "px";
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
    for (const beeId in world.bees) {
      const bee = world.bees[beeId];
      if (bee.mine) {
        bee.selected = false;
      }
    }
    // world.bees.map((bee) => (bee.selected = false));
  }

  onMouseRightClick(event) {
    event.preventDefault();
    this.rightClickAnimation(event);
    for (let beeId in world.bees) {
      world.bees[beeId].onRightClick(event);
    }
  }

  rightClickAnimation(event) {
    const myDiv = document.createElement("div");
    myDiv.classList.add("right-click-animation");
    myDiv.style.left = event.pageX - 20 + "px";
    myDiv.style.top = event.pageY - 20 + "px";
    const placeholderClick = document.getElementById("right-click");
    placeholderClick.appendChild(myDiv);
  }

  checkForScroll() {
    this.isMouseInOuterBorder = !isPointInsideSelectionBox(
      cursor.x,
      cursor.y,
      this.outerBorders.offsetLeft,
      this.outerBorders.offsetTop,
      this.outerBorders.offsetWidth,
      this.outerBorders.offsetHeight,
    );
  }

  updateSelectionBox() {
    if (!this.isDragging) return;
    this.boxWidth = cursor.x - this.startMouseX;
    this.boxHeight = cursor.y - this.startMouseY;
    selectionBox.style.width = Math.abs(this.boxWidth) + "px";
    selectionBox.style.height = Math.abs(this.boxHeight) + "px";
    if (this.boxWidth < 0) {
      selectionBox.style.left = cursor.x + "px";
    }

    if (this.boxHeight < 0) {
      selectionBox.style.top = cursor.y + "px";
    }
  }

  lookForEntitiesInsideSelectionBox() {
    for (let beeId in world.bees) {
      if (world.bees[beeId].mine) {
        world.bees[beeId].isInsideSelectionBox({
          offsetLeft: selectionBox.offsetLeft - xOffset,
          offsetTop: selectionBox.offsetTop - yOffset,
          width: Math.abs(this.boxWidth),
          height: Math.abs(this.boxHeight),
        });
      }
    }
  }

  checkIfMouseIsOnMinimap() {
    this.isMouseOnMiniMap = isPointInsideSelectionBox(
      cursor.x,
      cursor.y,
      this.miniMap.offsetLeft,
      this.miniMap.offsetTop,
      this.miniMap.offsetWidth,
      this.miniMap.offsetHeight
    )
  }

  scroll() {
    if (this.isMouseInOuterBorder && !this.isMiniMapFocused) {
      const leftRef = (cursor.x - window.innerWidth/2)/(window.innerWidth/2);
      const topRef = (cursor.y - window.innerHeight/2)/(window.innerHeight/2);
      if (!isNaN(leftRef) && !isNaN(topRef)) {
        xOffset -= leftRef*10;
        yOffset -= topRef*10;
      }
    }
    if (xOffset < MAX_OFFSET_X_INF) {
      xOffset = MAX_OFFSET_X_INF;
    }
    if (yOffset < MAX_OFFSET_Y_INF) {
      yOffset = MAX_OFFSET_Y_INF;
    }
    if (xOffset > MAX_OFFSET_X_SUP) {
      xOffset = MAX_OFFSET_X_SUP;
    }
    if (yOffset > MAX_OFFSET_Y_SUP) {
      yOffset = MAX_OFFSET_Y_SUP;
    }
  }
}
