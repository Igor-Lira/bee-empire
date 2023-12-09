const canvas = document.getElementById('canvas');
let selectionBox = document.getElementById('selection-box');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const map = new Quadtree({
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  maxLevels: 4
});

const cursor = {
  x : 0,
  y : 0,
  width : 28,
  height : 28
};

let objects = [];
let walls = [];

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

