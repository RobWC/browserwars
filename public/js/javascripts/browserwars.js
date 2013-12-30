$(document).ready(function() {
  //enable mute button
  var MUTED_MUSIC = ($.jStorage.get('MUTED_MUSIC')) ? true : false;
  var MUTED_SOUNDS = ($.jStorage.get('MUTED_SOUNDS')) ? true : false;

  if (MUTED_MUSIC) {
    $('#muteMusic').addClass('active');
    document.getElementById('theme').pause();
    document.getElementById('trouble').pause();
    $.jStorage.set('MUTED_MUSIC', true)
    MUTED_MUSIC = true; 
  } else {
    $.jStorage.set('MUTED_MUSIC', false)
    $('#muteMusic').removeClass('active');
    document.getElementById('theme').play();
    MUTED_MUSIC = false;
  };

  if (MUTED_SOUNDS) {
    $('#muteSounds').addClass('active');
    $.jStorage.set('MUTED_SOUNDS', true)
    MUTED_SOUNDS = true; 
  } else {
    $.jStorage.set('MUTED_SOUNDS', false)
    $('#muteSounds').removeClass('active');
    document.getElementById('theme').play();
    MUTED_SOUNDS = false;
  };

  //mute sounds
  var playEffect = function(id) {
    if (MUTED_SOUNDS) {
      //dont play the sound
    } else {
      document.getElementById(id).play();
    }
  }


  $('#muteSounds').click(function(){
    if (MUTED_SOUNDS) {
      $.jStorage.set('MUTED_SOUNDS', false)
      MUTED_SOUNDS = false;
    } else {
      $.jStorage.set('MUTED_SOUNDS', true)
      MUTED_SOUNDS = true;
    }
  });

  $('#muteMusic').click(function(){
    if (MUTED_MUSIC) {
      if (actor.lives > 0) {
        document.getElementById('theme').play();
        document.getElementById('trouble').pause();
      } else {
        document.getElementById('theme').pause();
        document.getElementById('trouble').play();
      }
      $.jStorage.set('MUTED_MUSIC', false)
      MUTED_MUSIC = false;
    } else {
      if (actor.lives > 0) {
        document.getElementById('theme').pause();
        document.getElementById('trouble').pause();
      } else {
        document.getElementById('theme').pause();
        document.getElementById('trouble').pause();
      }
      $.jStorage.set('MUTED_MUSIC', true)
      MUTED_MUSIC = true;
    }
  })

  //setup requestAnimationFrame
  var FRAME_RATE = 60;
  $.jStorage.set('MUTED_MUSIC',MUTED_MUSIC)
  $.jStorage.set('MUTED_SOUNDS',MUTED_SOUNDS)
  var then = 0;
  var shots = [];
  var enemyShots = [];
  var enemies = [];
  var explosions = [];
  var screenTiles = [];
  var keysDown = {};
  var shootUp = true;
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
    MUTED_MUSIC = $.jStorage.get('MUTED_MUSIC')
    MUTED_SOUNDS = $.jStorage.get('MUTED_SOUNDS')
    enemies = [];
    enemyShots = [];
    shots = [];
    actor.x = canvas.width / 2;
    actor.y = canvas.height + 30;
    explosions = [];
    screenTiles = [];
    keysDown = {};
    generateScreen(canvas, screenTiles);
    addEventListener('keydown', function(e) {
      if(e.keyCode == 32 && shootUp == true) {
        shootUp = false;
        actor.shoot(shootImage, shots);
      } else {
        keysDown[e.keyCode] = true;
      }
    }, false);

    addEventListener('keyup', function(e) {
      shootUp = true;
      delete keysDown[e.keyCode];
    }, false);
  };

  var killActor = function() {
    playEffect('death');
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
      cctx.globalAlpha = 0.4;
      cctx.drawImage(actor.img,actor.x/2,actor.y/2,256,256);
      cctx.globalAlpha = 0.4;
      var lingrad = ctx.createRadialGradient(actor.x, actor.y, actor.x + 4, actor.y + 4, Math.PI, Math.PI);
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
      cctx.arc(actor.x, actor.y, 256, 0, Math.PI*2, true);
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
      cctx.fillText('You are DEAD!', WIDTH / 2, HEIGHT / 2 + 75)
      cctx.fillText('Press Enter to restart', WIDTH / 2, HEIGHT / 2 + 125)
      $('#coverScreen').css('z-index', 3)
      addEventListener('keydown', function(e) {
        if(e.keyCode == 13) {
          this.removeEventListener('keydown', arguments.callee, false);
          $('#coverScreen').css('z-index', 1)
          coverLayer.width = WIDTH;
          actor.lives = 2;
          actor.score = 0;
          if (!MUTED_MUSIC) {
            document.getElementById('theme').play();
            document.getElementById('trouble').pause();
          };
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
          if (0 == actor.lives && !MUTED) {
            document.getElementById('theme').pause();
            document.getElementById('trouble').play();
          }
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

  function shootEnemy(enemy, shot) {
    actor.score = actor.score + enemies[enemy].value;
    explosions.push(new Explosion(enemies[enemy].x, enemies[enemy].y));
    enemies.splice(enemy, 1);
    shots.splice(shot, 1);
    playEffect('explode');
  }


  function draw() {
      loopID = requestAnimationFrame(draw, canvas)
      //check for bonus
      if (actor.score / 1000 > actor.bonus) {
        actor.lives = actor.lives + 1;
        actor.bonus = actor.bonus + 1;
      }
      ctx.save()
      var now = new Date().getTime();
      var delta = now - then;
      actor.move(keysDown, canvas, delta / 1000);
      spawn(enemies);
      then = now;
      if(spaceBGImage.ready && starsBGImage) {
        generateScreenRow(canvas, screenTiles);
        drawScreen(canvas, screenTiles);
      };
      for(var i = 0; i < explosions.length; i++) {
        if(explosions[i].explode(ctx)) {
          explosions.shift(i, 1);
        }
      }
      //actor shots
      for(var i = 0; i < shots.length; i++) {
        shots[i].y = shots[i].y - 12;
        if(checkEdgeCollisions(shots[i])) {
          shots.splice(i, 1);
        } else {
          ctx.drawImage(shots[i].img, shots[i].x, shots[i].y);
        }
      }
      //enemy shots
      for(var i = 0; i < enemyShots.length; i++) {
        enemyShots[i].y = enemyShots[i].y + 8;
        if(checkEdgeCollisions(enemyShots[i])) {
          enemyShots.splice(i, 1);
        } else {
          ctx.drawImage(enemyShots[i].img, enemyShots[i].x, enemyShots[i].y);
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
          var shot = Math.random()
          if (shot > 0.7 && shot < 0.71) {
            enemies[i].shoot(looperShotImage,enemyShots);
          }
          ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y);
        }
      }
      //check to see if player has collided with an enemy
      for(var i = 0; i < enemies.length; i++) {
        if(boundingBoxCollide(actor, enemies[i])) {
          killActor()
        }
      }
      for (var i = 0; i < enemyShots.length; i++) {
        if(boundingBoxCollide(actor, enemyShots[i])) {
          killActor();
        }
      }
      //check if enemies collided with a shot
      for(var i = 0; i < enemies.length; i++) {
        for(var j = 0; j < shots.length; j++) {
          if(boundingBoxCollide(shots[j], enemies[i])) {
            actor.killEnemy(i, j);
          }
        }
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "20px Arial";
      ctx.textBaseline = 'top';
      ctx.fillText(actor.name + ' Warrior', WIDTH - 180, 12);
      ctx.fillText('Score: ' + actor.score, WIDTH - 180, 32);
      ctx.fillText('Lives: ', WIDTH - 180, 52);
      var lifeX = 120;
      for(var i = 0; i < actor.lives; i++) {
        ctx.drawImage(actor.img, WIDTH - lifeX, 55, 16, 16)
        lifeX = lifeX - 20;
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