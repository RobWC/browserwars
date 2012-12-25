

var shootReady = false;
var shootImage = new Image();
shootImage.src = '/images/shot.png';
shootImage.onload = function() {
  shootReady = true;
};

var looperShotReady = false;
var looperShotImage = new Image();
looperShotImage.src = '/images/Looper-shot.png';
looperShotImage.onload = function() {
  looperShotReady = true;
};

var attackers = {
  slasher: {
    img: loadImage('/images/Slasher-eye.png'),
    x: 0,
    y: 0,
    type: 'diagnal',
    direction: 'right',
    attack: true,
    value: 20
  },
  looper: {
    img: loadImage('/images/Looper.png'),
    x: 0,
    y: 0,
    type: 's-pattern',
    direction: 'right',
    attack: true,
    value: 10,
    weapons: {
      shoot: {
        active: true,
        img: loadImage('/images/Looper-shot.png')
      }
    }
  },
  rocket: {
    img: loadImage('/images/Rocket.png'),
    x: 0,
    y: 0,
    type: 'rocket',
    direction: 'down',
    attack: false,
    value: 100,
    special: {
      engine: true
    }
  }
}

var Enemy = function(width,kind) {
  var xRand = parseInt(Math.floor((Math.random() * width)) + 1);
  if (xRand < 32) {
    xRand = xRand + 32;
  } else if (xRand > width) {
    xRand = width - 32;
  }
  this.img = kind.img;
  this.x = xRand;
  this.y = kind.y;
  this.type = kind.type;
  this.value = kind.value;
  this.attack = kind.attack;
  this.weapons = (!!kind.weapons) ? kind.weapons : '';
  this.direction = kind.directiom;
};

Enemy.prototype.move = function(width,tile_size) {
  var self = this;
  if(self.type == 'diagnal') {
    if (self.x + tile_size + 16 > width || self.x - tile_size/2 < 0) {
      self.y = parseInt(Math.round(this.y + 32));
      if (self.direction == 'right') {
        self.direction = 'left';
      } else {
        self.direction = 'right';
      }
    };
    self.y = Math.round(self.y + 2);
    if (self.direction == 'right') {
      self.x = parseInt(Math.round(self.x + 8));
    } else {
      self.x = parseInt(Math.round(self.x - 8));
    }
  } else if(self.type == 's-pattern') {
    if (self.x + tile_size + 16 > width || self.x - tile_size/2 < 0) {
      self.y = parseInt(Math.round(this.y + 32));
      if (self.direction == 'right') {
        self.direction = 'left';
      } else {
        self.direction = 'right';
      }
    } 
    if (self.direction == 'right') {
      self.x = parseInt(Math.round(self.x + 6));
    } else {
      self.x = parseInt(Math.round(self.x - 6));
    }
  } else if (self.type == 'rocket') {
      self.y = parseInt(Math.round(this.y + 10));
  }
};

Enemy.prototype.shoot = function(looperShotImage,enemyShotArray) {
  var self = this;
  if (self.attack == true && typeof self.weapons == 'object' && looperShotReady) {
    document.getElementById('enemyShoot').play();
    enemyShotArray.push(new Shot(looperShotImage,self.x,self.y))
  }
}

Enemy.prototype.die = function() {
  var self = this;
}


var browser = {
  chrome: {
    name: 'Chrome',
    img: new loadImage('/images/Chrome.png'),
    regex: /(Chrome)\/(\d+\.\d+)/g,
    speed: 400,
  },
  firefox: {
    name: 'Firefox',
    img: new loadImage('/images/Firefox.png'),
    regex: /(Firefox)\/(\d+\.\d+)/g,
    speed: 300
  },
  safari: {
    name: 'Safari',
    img: new loadImage('/images/Safari.png'),
    regex: /(Version)\/(\d+\.\d+)/g,
    speed: 340
  },
  opera: {
    name: 'Opera',
    img: new loadImage('/images/Opera.png'),
    regex: /(Opera)\/(\d+\.\d+)/g,
    speed: 280
  },
  ie: {
    name: 'Interet Explorer',
    img: new loadImage('/images/IE.png'),
    regex: /MSIE\s([\d]+)/g,
    speed: 354
  },
  other: {
    name: 'Other',
    img: new loadImage('/images/OtherBrowser.png'),
    regex: /.*/,
    speed: 256
  }
};

var browserChar = function(browserObj) {
    this.name = browserObj.name;
    this.img = browserObj.img;
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

browserChar.prototype.die = function() {

}

browserChar.prototype.move = function(keysDown, canvas, modifier) {
  var self = this;
  if(38 in keysDown || 87 in keysDown) {
    self.y = Math.round(self.y - (self.speed * modifier));
  };
  if(40 in keysDown || 83 in keysDown) {
    self.y = Math.round(self.y + (self.speed * modifier));
  };
  if(37 in keysDown || 65 in keysDown) {
    self.x = Math.round(self.x - (self.speed * modifier));
  };
  if(39 in keysDown || 68 in keysDown) {
    self.x = Math.round(self.x + (self.speed * modifier));
  };
  self.checkEdgeCollisionsShip(canvas);
};

browserChar.prototype.checkEdgeCollisionsShip = function(canvas) {
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

browserChar.prototype.shoot = function(shootImage,shotArray) {
   var self = this;
   if (shootReady) {
      document.getElementById('shoot').play();
      shotArray.push(new Shot(shootImage,self.x,self.y))
   }
 };

browserChar.prototype.die = function() {
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

var Explosion = function(x, y) {
  this.x = x;
  this.y = y;
  this.frame = 0;
  this.maxFrame = Math.floor(Math.random() * 40) + 20;
};

Explosion.prototype.explode = function(ctx) {
  this.frame = this.frame + 1;
  var lingrad = ctx.createRadialGradient(this.x, this.y, this.x + 4, this.y + 4, Math.PI, Math.PI);
  lingrad.addColorStop(0, 'rgba(255,0,0,.8)');
  lingrad.addColorStop(0.2, 'rgba(255,255,0,.8)');
  lingrad.addColorStop(0.4, 'rgba(255,0,0,.8)');
  lingrad.addColorStop(0.6, 'rgba(255,255,0,.8)');
  lingrad.addColorStop(0.8, 'rgba(255,0,0,.8)');
  lingrad.addColorStop(1, 'rgba(255,255,0,.8)');
  var lingrad2 = ctx.createRadialGradient(this.x, this.y, this.x + 4, this.y + 4, Math.PI, Math.PI);
  lingrad2.addColorStop(1, 'rgba(0,0,0,.7)');
  ctx.fillStyle = lingrad;
  ctx.strokeStyle = lingrad2;
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 8 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 8 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 8 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 8 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 8 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 8 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 8 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 8 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 14 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 14 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 14 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 14 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 14 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 14 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 14 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 14 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 20 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 6 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 20 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 6 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 20 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 6 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 20 - this.frame / 3, Math.round(Math.random() * 6 + 1) +this.y + 6 + this.frame / 3, this.frame / 8, this.frame / 8)
  if(this.frame == this.maxFrame) {
    return true;
  } else {
    return false;
  }
};

var Shot = function(shootImage,x,y) {
  this.img = shootImage;
  this.x = x;
  this.y = y;
};