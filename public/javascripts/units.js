var attackers = {
  slasher: {
    img: loadImage('/images/Slasher.png'),
    x: 0,
    y: 0,
    type: 'diagnal',
    direction: 'right'
  },
  looper: {
    img: loadImage('/images/OtherBrowser.png'),
    x: 0,
    y: 0,
    type: 's-pattern',
    direction: 'right'
  }
}

var Enemy = function(kind) {
    this.img = kind.img;
    this.x = parseInt(Math.floor((Math.random() * WIDTH)) + 1);
    this.y = kind.y;
    this.type = kind.type;
    this.directon = kind.direction;
  };

Enemy.prototype.move = function() {
  var self = this;
  if(self.type == 'diagnal') {
    if (self.x + TILE_SIZE + 16 > WIDTH || self.x - TILE_SIZE/2 < 0) {
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
    if (self.x + TILE_SIZE + 16 > WIDTH || self.x - TILE_SIZE/2 < 0) {
      self.y = parseInt(Math.round(this.y + 32));
      if (self.direction == 'right') {
        self.direction = 'left';
      } else {
        self.direction = 'right';
      }
    }
    if (self.direction == 'right') {
      self.x = parseInt(Math.round(self.x + 8));
    } else {
      self.x = parseInt(Math.round(self.x - 8));
    }
  }
};

Enemy.prototype.die = function() {
  var self = this;
}


var browser = {
  chrome: {
    name: 'Chrome',
    img: new loadImage('/images/Chrome.png'),
    regex: /(Chrome)\/(\d+\.\d+)/g,
    speed: 356,
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
    this.shots = 0;
    this.ready = false;
  };

browserChar.prototype.die = function() {

}

browserChar.prototype.move = function(keysDown, canvas, modifier) {
  var self = this;
  if(38 in keysDown) {
    self.y = Math.round(self.y - (self.speed * modifier));
  };
  if(40 in keysDown) {
    self.y = Math.round(self.y + (self.speed * modifier));
  };
  if(37 in keysDown) {
    self.x = Math.round(self.x - (self.speed * modifier));
  };
  if(39 in keysDown) {
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