(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var TILE_SIZE = 32;
var WIDTH = 640;
var HEIGHT = 480;
var starsBGImage = new loadImage('/images/Space.png');
var spaceBGImage = new loadImage('/images/Space-blank.png');

var initalScreen = function(canvas) {
  var titleName = 'BrowserWars!'
  var ctx = canvas.getContext('2d');
  ctx.drawImage(browser.chrome.img,HEIGHT/2,WIDTH/2);
  ctx.textAlign = 'center';
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.shadowColor = '#0000FF';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 3;
  ctx.strokeStyle = "#0000FF";
  ctx.lineWidth = 12;
  ctx.font = "40px Helvetica Neue";
  ctx.strokeText(titleName,WIDTH/2,HEIGHT/2 + 85)
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 3;
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.strokeText(titleName,WIDTH/2,HEIGHT/2 + 85)
  ctx.strokeStyle = "#0000FF";
  ctx.font = "24px Helvetica Neue";
  ctx.fillText('Press Enter to Begin',WIDTH/2,HEIGHT/2 + 125)
}

function generateScreenRow(canvas,tiles) {
    var width = canvas.width;
    var height = canvas.height;
    var rows = height / (TILE_SIZE / 2);
    var columns = width / (TILE_SIZE / 2);
    tiles.pop()
    var row = new Array(columns);
    for (var j = 0; j < columns; j++) {
      var random = Math.random();
      if (random > 0.1 && random < 0.3) {
        //push star
        row[j] = 'star';
      } else {
        //push black
        row[j] = 'black';
      }
    }
    tiles.unshift(row);
  }
  
  function drawScreen(canvas,tiles) {
    var ctx_ds = canvas.getContext('2d');
    for(var i = 0; i < tiles.length; i++) {
      for (var j = 0; j < tiles[i].length; j++) {
        if (tiles[i][j] == 'star') {
          ctx_ds.drawImage(starsBGImage,j*TILE_SIZE,i*TILE_SIZE);
        } else if (tiles[i][j] == 'black') {
          ctx_ds.drawImage(spaceBGImage,j*TILE_SIZE,i*TILE_SIZE);
        }
      };
    };
  }
  
   
  var generateScreen = function(canvas,tiles) {
    //get width of the canvas
    //get height of the canvas
    //determine the total number of rows & columns
    //select a star tile 20% of the time
    var width = canvas.width;
    var height = canvas.height;
    var rows = height / (TILE_SIZE / 2);
    var columns = width / (TILE_SIZE / 2);
    for (var i = 0; i < rows; i++) {
      var row = new Array(columns);
      tiles.push(row);
      for (var j = 0; j < columns; j++) {
        var random = Math.random();
        if (random > 0.1 && random < 0.3) {
          //push star
          tiles[i][j] = 'star';
        } else {
          //push black
          tiles[i][j] = 'black';
        }
      }
    }
  }
  