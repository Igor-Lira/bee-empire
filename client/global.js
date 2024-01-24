const canvas = document.getElementById('content');
let selectionBox = document.getElementById('selection-box');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = "48px serif";

let MAX_OFFSET_X_INF = -1800;
let MAX_OFFSET_Y_INF = -1900;

let MAX_OFFSET_X_SUP = 200;
let MAX_OFFSET_Y_SUP = 200;

const cursor = {
  x : 0,
  y : 0,
  width : 28,
  height : 28
};

let isMouseover = false;

window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

let xOffset = 0;
let yOffset = 0;
let world;
