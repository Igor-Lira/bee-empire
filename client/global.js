const canvas = document.getElementById('canvas');
let selectionBox = document.getElementById('selection-box');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = "48px serif";

let id = 0;
const map = {
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  honeycomb: null,
  maxLevels: 4
};


const cursor = {
  x : 0,
  y : 0,
  width : 28,
  height : 28
};

let objects = [];
let hexagons = {};
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

const hexSize = 100;
const hexHeight = hexSize * Math.sqrt(3);
const hexWidth = hexSize * 1.5;
const rows = 3;
const cols = 3;
const xOffset = 500;
const yOffset = 200;
