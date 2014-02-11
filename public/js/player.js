var Player = function(name) {
  this.name = name;
  this.img = ''; //Player image
  this.speed = browserObj.speed;
  this.x = 0;
  this.y = 0;
  this.score = 0;
  this.lives = 2;
  this.enemiesKilled = 0;
  this.bonus = 1;
  this.shots = 0;
  this.ready = false;
};

Player.prototype.move = function(keysDown, canvas, modifier) {
  var self = this;
  if(38 in keysDown || 87 in keysDown) {
    self.y = Math.round(self.y - (self.speed * modifier));
  }
  if(40 in keysDown || 83 in keysDown) {
    self.y = Math.round(self.y + (self.speed * modifier));
  }
  if(37 in keysDown || 65 in keysDown) {
    self.x = Math.round(self.x - (self.speed * modifier));
  }
  if(39 in keysDown || 68 in keysDown) {
    self.x = Math.round(self.x + (self.speed * modifier));
  }
  self.checkEdgeCollisionsShip(canvas);
};

Player.prototype.checkEdgeCollisionsShip = function(canvas) {
  var self = this;
  var maxWidth = canvas.width - self.img.width;
  var maxHeight = canvas.height - self.img.height;
  //check all
  if(self.x < 0) {
    self.x = 0;
    return true;
  } else if(self.y < 0) {
    self.y = 0;
    return true;
  } else if(self.x > maxWidth) {
    self.x = maxWidth;
    return true;
  } else if(self.y > maxHeight) {
    self.y = maxHeight;
    return true;
  } else {
    return false;
  }
};

Player.prototype.shoot = function(shootImage,shotArray) {
 var self = this;
 if (shootReady) {
    document.getElementById('shoot').play();
    shotArray.push(new Shot(shootImage,self.x,self.y));
 }
};

Player.prototype.die = function() {
    var self = this;
    document.getElementById('death').play();
    self.lives = self.lives - 1;
    if(0 > self.lives) {
      //game over screen
      var cctx = document.getElementById('coverScreen').getContext('2d');
      cctx.globalAlpha = 0.2;
      cctx.fillStyle = "#FFFFFF";
      cctx.fillRect(0, 0, document.getElementById('coverScreen').width, document.getElementById('coverScreen').height);
      cctx.globalAlpha = 1;
      cctx.fillStyle = "#FF0000";
      cctx.font = "24px Helvetica Neue";
      cctx.textAlign = 'center';
      cctx.globalAlpha = 0.4;
      cctx.drawImage(self.img,self.x/2,self.y/2,256,256);
      cctx.globalAlpha = 0.4;
      var lingrad = cctx.createRadialGradient(self.x, self.y, self.x + 4, self.y + 4, Math.PI, Math.PI);
      lingrad.addColorStop(0, 'rgba(255,0,0,.8)');
      lingrad.addColorStop(0.1, 'rgba(255,128,0,.8)');
      lingrad.addColorStop(0.2, 'rgba(255,255,0,.8)');
      lingrad.addColorStop(0.3, 'rgba(255,128,0,.8)');
      lingrad.addColorStop(0.4, 'rgba(240,0,0,.8)');
      lingrad.addColorStop(0.5, 'rgba(255,255,0,.8)');
      lingrad.addColorStop(0.6, 'rgba(255,128,0,.8)');
      lingrad.addColorStop(0.8, 'rgba(255,0,0,.8)');
      lingrad.addColorStop(1, 'rgba(255,255,0,.8)');
      cctx.beginPath();
      cctx.fillStyle = lingrad;
      cctx.arc(self.x, self.y, 256, 0, Math.PI*2, true);
      cctx.closePath();
      cctx.fill();
      cctx.font = "36px Helvetica Neue";
      cctx.fillStyle = "#FF0000";
      cctx.globalAlpha = 1;
      cctx.shadowColor = '#FFFFFF';
      cctx.shadowOffsetX = 2;
      cctx.shadowOffsetY = 4;
      cctx.shadowBlur = 5;
      cctx.strokeStyle = "#0000FF";
      cctx.lineWidth = 12;
      cctx.fillText('You are DEAD!', document.getElementById('coverScreen').width / 2, document.getElementById('coverScreen').height / 2 + 75)
      cctx.fillText('Press Enter to restart', document.getElementById('coverScreen').width / 2, document.getElementById('coverScreen').height / 2 + 125)
      $('#coverScreen').css('z-index', 3);
      self.lives = 2;
      self.score = 0;
    } else {
      var cctx = document.getElementById('coverScreen').getContext('2d');
      cctx.globalAlpha = 0.2;
      cctx.fillStyle = "#FFFFFF";
      cctx.fillRect(0, 0, document.getElementById('coverScreen').width, document.getElementById('coverScreen').width);
      cctx.globalAlpha = 1;
      cctx.textAlign = 'center';
      cctx.strokeStyle = "#0000FF";
      cctx.font = "24px Helvetica Neue";
      cctx.fillText('You have been defeated!', document.getElementById('coverScreen').width / 2, document.getElementById('coverScreen').height / 2 + 75)
      cctx.fillText('Press Enter to continue', document.getElementById('coverScreen').width / 2, document.getElementById('coverScreen').height / 2 + 125)
      $('#coverScreen').css('z-index', 3);
    }
  }