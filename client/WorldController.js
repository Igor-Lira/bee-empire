class WorldController {
  miniMap;
  isMiniMapFocused = false;
  isMouseOnMiniMap = false;
  outerBorders;
  isMouseInOuterBorder = false;

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
    this.checkForScroll(event);
    this.checkMinimap(event);
  }

  onMouseClick() {
    this.isMiniMapFocused = this.isMouseOnMiniMap;
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

  checkMinimap() {
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
