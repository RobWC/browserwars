$(document).ready(function(){
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 512;
  document.body.appendChild(canvas);
  
  var bgReady = false;
  var bgImage = new Image();
  bgImage.src = '/images/Background2.png';
  bgImage.onload = function() {
    bgReady = true;
  };
  
  var browserChar = function(name,imgSrc) {
    this.name = '';
    this.image = new Image();
    this.image.src = imgSrc;
    this.speed = 256;
    this.x = 0;
    this.y = 0;
    this.ready = false;
  }
  
  var getBrowserName = function() {
    var userAgent = navigator.userAgent;
    var chromeMatch = /(Chrome)\/(\d+\.\d+)/g.exec(userAgent);
    var firefoxMatch = /(Firefox)\/(\d+\.\d+)/g.exec(userAgent);
    var safariMatch = /(Version)\/(\d+\.\d+)/g.exec(userAgent);
    if (chromeMatch != null && chromeMatch.length > 1) {
      return new browserChar('Chrome','/images/Chrome.png');
    };
    if (firefoxMatch != null && firefoxMatch.length > 1) {
      return new browserChar('Firefox', '/images/Firefox.png');
    }
  };
  
  var actor = getBrowserName();
  
  actor.image.onload = function() {
    actor.ready = true;
  };
  
  var keysDown = {};
  
  addEventListener('keydown',function(e){
    keysDown[e.keyCode] = true;
  }, false);
  
  addEventListener('keyup',function(e){
    delete keysDown[e.keyCode];
  }, false);
  
  var reset = function() {
    actor.x = canvas.width / 2;
    actor.y = canvas.height / 2;
  };
  
  var checkEdgeCollisions = function() {
    var maxWidth = canvas.width - actor.image.width;
    var maxHeight = canvas.height - actor.image.height;
    //check all
    if (actor.x < 0) {
      actor.x = 0;
    };
    if (actor.y < 0) {
      actor.y = 0;
    };
    if (actor.x > maxWidth) {
      actor.x = maxWidth;
    };
    if (actor.y > maxHeight) {
      actor.y = maxHeight;
    };
  };
  
  var update = function(modifier) {
    if (38 in keysDown) {
      actor.y -= actor.speed * modifier;
    };
    if (40 in keysDown) {
      actor.y += actor.speed * modifier;
    };
    if (37 in keysDown) {
      actor.x -= actor.speed * modifier;
    };
    if (39 in keysDown) {
      actor.x += actor.speed * modifier;
    };
    checkEdgeCollisions();
  };
  
  var render = function () {
    if (bgReady) {
      for(var i = 0; i < 32; i++) {
        for (var j = 0; j < 32; j++) {
          ctx.drawImage(bgImage,i*32,j*32,32,32);
        };
      };
    };
    if (actor.ready) {
      ctx.drawImage(actor.image,actor.x,actor.y,32,32);
    };
  };
  

  
  var main = function () {
    var now = Date.now();
    var delta = now - then;
    //console.log(actor.x + ' ' + actor.y)
  
    update(delta / 1000);
    render();
  
    then = now;
  };
  
  reset();
  var then = Date.now();
  setInterval(main,1)
  
});