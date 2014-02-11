var Enemy = function(width,kind) {
  this.img = kind.img;
  this.x = 0;
  this.y = 0;
  this.type = kind.type;
  this.value = kind.value;
  this.attack = kind.attack;
  this.weapons = (!!kind.weapons) ? kind.weapons : '';
  this.direction = kind.directiom;
};

Enemy.prototype.move = function(width,tile_size) {
  var self = this;
  if(self.type == 'diagonal') {
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
  if (self.attack === true && typeof self.weapons == 'object' && looperShotReady) {
    document.getElementById('enemyShoot').play();
    enemyShotArray.push(new Shot(looperShotImage,self.x,self.y));
  }
};

Enemy.prototype.die = function() {
  var self = this;
};