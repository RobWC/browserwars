$(document).ready(function() {
  //setup requestAnimationFrame
  var FRAME_RATE = 60;
  var then = 0;
  var shots = [];
  var enemies = [];
  var explosions = [];
  var screenTiles = [];
  var keysDown = {};
  var canvas = document.getElementById('gameScreen');
  var coverLayer = document.getElementById('coverScreen');
  coverLayer.width = WIDTH;
  coverLayer.height = HEIGHT;
  var ctx = canvas.getContext('2d');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  var loopID = 0;
  var actor = getBrowserName();

  var reset = function() {
    actor.x = canvas.width / 2;
    actor.y = canvas.height + 30;
    enemies = [];
    shots = [];
    explosions = [];
    screenTiles = [];
    keysDown = {};
    generateScreen(canvas, screenTiles);
    addEventListener('keydown', function(e) {
      if(e.keyCode == 32) {
        shoot(ctx, actor, shootImage, shots);
      } else {
        keysDown[e.keyCode] = true;
      }
    }, false);

    addEventListener('keyup', function(e) {
      delete keysDown[e.keyCode];
    }, false);
  };

  var killActor = function() {
    setTimeout(function() {
      cancelAnimationFrame(loopID);
    }, 1 * 1)
    actor.lives = actor.lives - 1;
    if(0 > actor.lives) {
      //game over screen
      var cctx = coverLayer.getContext('2d');
      cctx.globalAlpha = 0.2;
      cctx.fillStyle = "#FFFFFF";
      cctx.fillRect(0, 0, WIDTH, HEIGHT);
      cctx.globalAlpha = 1;
      cctx.fillStyle = "#FF0000";
      cctx.font = "24px Helvetica Neue";
      cctx.textAlign = 'center';
      cctx.fillText('You are DEAD!', WIDTH / 2, HEIGHT / 2 + 75)
      cctx.fillText('Press Enter to restart', WIDTH / 2, HEIGHT / 2 + 125)
      $('#coverScreen').css('z-index', 3)
      addEventListener('keydown', function(e) {
        if(e.keyCode == 13) {
          this.removeEventListener('keydown', arguments.callee, false);
          //write you died or some shit
          $('#coverScreen').css('z-index', 1)
          coverLayer.width = WIDTH;
          actor.lives = 2;
          actor.score = 0;
          reset();
          draw()
          $('#coverScreen').css('z-index', 1)
        }
      }, false);
    } else {
      var cctx = coverLayer.getContext('2d');
      cctx.globalAlpha = 0.2;
      cctx.fillStyle = "#FFFFFF";
      cctx.fillRect(0, 0, WIDTH, HEIGHT);
      cctx.globalAlpha = 1;
      cctx.textAlign = 'center';
      cctx.strokeStyle = "#0000FF";
      cctx.font = "24px Helvetica Neue";
      cctx.fillText('You have been defeated!', WIDTH / 2, HEIGHT / 2 + 75)
      cctx.fillText('Press Enter to continue', WIDTH / 2, HEIGHT / 2 + 125)
      $('#coverScreen').css('z-index', 3)
      addEventListener('keydown', function(e) {
        if(e.keyCode == 13) {
          this.removeEventListener('keydown', arguments.callee, false);
          //write you died or some shit
          $('#coverScreen').css('z-index', 1)
          coverLayer.width = WIDTH;
          reset();
          draw();
          $('#coverScreen').css('z-index', 1)
        }
      }, false);
    }
  }

  var checkEdgeCollisions = function(item) {
      var maxWidth = canvas.width;
      var maxHeight = canvas.height;
      //check all
      if(item.x < 0) {
        item.x = 0;
        return true;
      } else if(item.y < 0) {
        item.y = 0;
        return true;
      } else if(item.x > maxWidth) {
        item.x = maxWidth;
        return true;
      } else if(item.y > maxHeight) {
        item.y = maxHeight;
      } else {
        return false;
      }
    };

  var checkEdgeCollisionsEnemies = function(item) {
      var maxWidth = canvas.width - item.img.width;
      var maxHeight = canvas.height - item.img.height;
      //check all
      if(item.x < 0) {
        item.x = 0;
        return true;
      } else if(item.y < 0) {
        item.y = 0;
        return true;
      } else if(item.x > maxWidth) {
        item.x = maxWidth;
        return true;
      } else if(item.y > maxHeight) {
        item.y = maxHeight;
        return true;
      } else {
        return false;
      }
    };

  var Explosion = function(x, y) {
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.maxFrame = 60;
  }

  Explosion.prototype.explode = function() {
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
    ctx.fillRect(this.x + 2 + this.frame / 3, this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 2 - this.frame / 3, this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 2 - this.frame / 3, this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 2 + this.frame / 3, this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 8 + this.frame / 3, this.y + 8 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 8 - this.frame / 3, this.y - 8 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 8 + this.frame / 3, this.y - 8 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 8 - this.frame / 3, this.y + 8 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 2 + this.frame / 3, this.y + 14 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 2 - this.frame / 3, this.y - 14 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 2 + this.frame / 3, this.y - 14 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 2 - this.frame / 3, this.y + 14 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 14 + this.frame / 3, this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 14 - this.frame / 3, this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 14 + this.frame / 3, this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 14 - this.frame / 3, this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 20 + this.frame / 3, this.y + 6 + this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 20 - this.frame / 3, this.y - 6 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x + 20 + this.frame / 3, this.y - 6 - this.frame / 3, this.frame / 8, this.frame / 8)
    ctx.fillRect(this.x - 20 - this.frame / 3, this.y + 6 + this.frame / 3, this.frame / 8, this.frame / 8)
    if(this.frame == this.maxFrame) {
      return true;
    } else {
      return false;
    }
  }

  function shootEnemy(enemy, shot) {
    explosions.push(new Explosion(enemies[enemy].x, enemies[enemy].y));
    enemies.splice(enemy, 1);
    shots.splice(shot, 1);
    actor.score = actor.score + 10;
    document.getElementById('explode').play();
  }


  function draw() {
      loopID = requestAnimationFrame(draw, canvas)
      ctx.save()
      var now = new Date().getTime();
      var delta = now - then;
      actor.move(keysDown, canvas, delta / 1000);
      spawn(enemies);
      then = now;
      if(spaceBGImage.ready && starsBGImage) {
        generateScreenRow(canvas, screenTiles);
        drawScreen(canvas, screenTiles);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.textBaseline = 'top';
        ctx.fillText(actor.name + ' Warrior', WIDTH - 180, 12);
        ctx.fillText('Score: ' + actor.score, WIDTH - 180, 32);
        ctx.fillText('Lives: ', WIDTH - 180, 52);
        var lifeX = 100;
        for(var i = 0; i < actor.lives; i++) {
          ctx.drawImage(actor.img, WIDTH - lifeX, 55, 16, 16)
          lifeX = lifeX + 20;
        }
      };
      for(var i = 0; i < shots.length; i++) {
        shots[i].y = shots[i].y - 32;
        if(checkEdgeCollisions(shots[i])) {
          shots.splice(i, 1);
        } else {
          ctx.drawImage(shots[i].img, shots[i].x, shots[i].y);
        }
      }
      if(actor.img.ready) {
        ctx.drawImage(actor.img, actor.x, actor.y);
      };
      for(var i = 0; i < enemies.length; i++) {
        if(checkEdgeCollisionsEnemies(enemies[i], canvas)) {
          enemies.splice(i, 1);
        } else {
          enemies[i].move();
          ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y);
        }
      }
      //check to see if player has collided with an enemy
      for(var i = 0; i < enemies.length; i++) {
        if(boundingBoxCollide(actor, enemies[i])) {
          killActor()
        }
      }
      for(var i = 0; i < enemies.length; i++) {
        for(var j = 0; j < shots.length; j++) {
          if(boundingBoxCollide(shots[j], enemies[i])) {
            shootEnemy(i, j);
          }
        }
      }
      for(var i = 0; i < explosions.length; i++) {
        if(explosions[i].explode()) {
          explosions.shift(i, 1);
        }
      }
      ctx.restore();
  }

  initalScreen(canvas);
  addEventListener('keydown', function(e) {
    if(e.keyCode == 13) {
      this.removeEventListener('keydown', arguments.callee, false);
      canvas.width = canvas.width;
      reset();
      draw();
    }
  }, false);

});