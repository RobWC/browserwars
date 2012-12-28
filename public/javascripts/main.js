require(["jquery", "bootstrap.min", "modernizr", "jstorage", "supporting", "collisions"], function($) {
  require(["screen", "units"], function() {
    $(function() {
      var FRAME_RATE = 60;
      var browserLoopID = 0;
      var TILE_SIZE = 32;
      var WIDTH = 640;
      var HEIGHT = 480;
      var starsBGImage = new loadImage('/images/Space.png');
      var spaceBGImage = new loadImage('/images/Space-blank.png');
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

      //setup the sound state
      if ($.jStorage.get('MUTED_MUSIC')) {
        $('#muteMusic').addClass('active');
        document.getElementById('theme').pause();
      }
      else {
        $('#muteMusic').removeClass('active');
        document.getElementById('theme').play();
      };

      if ($.jStorage.get('MUTED_SOUNDS')) {
        $('#muteSounds').addClass('active');
        var sounds = $('audio:not([loop])');
        for (var i = 0; i < sounds.length; i++) {
          sounds[i].muted = true
        }
        $.jStorage.set('MUTED_SOUNDS', true)
      }
      else {
        $('#muteSounds').removeClass('active');
        var sounds = $('audio:not([loop])');
        for (var i = 0; i < sounds.length; i++) {
          sounds[i].muted = false
        }
        $.jStorage.set('MUTED_SOUNDS', true)
      };

      /**
  Setup sound buttons
  */
      $('#muteSounds').click(function() {
        var sounds = $('audio:not([loop])');
        for (var i = 0; i < sounds.length; i++) {
          sounds[i].muted = !sounds[i].muted;
        }
        $.jStorage.set('MUTED_SOUNDS', true)
      });

      $('#muteMusic').click(function() {
        if ($.jStorage.get('MUTED_MUSIC')) {
          document.getElementById('theme').play();
          $.jStorage.set('MUTED_MUSIC', false)
        }
        else {
          document.getElementById('theme').pause();
          $.jStorage.set('MUTED_MUSIC', true)
        }
      })

      function draw() {
        loopID = requestAnimationFrame(draw, canvas)
        //check for bonus
        if (actor.score != 0 && actor.score / 1000 > actor.bonus) {
          actor.lives = actor.lives + 1;
          actor.bonus = actor.bonus + 1;
        }
        ctx.save()
        var now = new Date().getTime();
        var delta = now - then;
        actor.move(keysDown, canvas, delta / 1000);
        var random = Math.random();
        if (random > 0.0 && random < 0.01) {
          enemies.push(new Enemy(canvas.width, attackers.slasher));
        }
        else if (random > 0.02 && random < 0.03) {
          enemies.push(new Enemy(canvas.width, attackers.looper));
        }
        else if (random > 0.05 && random < 0.06) {
          enemies.push(new Enemy(canvas.width, attackers.rocket));
        }
        then = now;
        if (spaceBGImage.ready && starsBGImage) {
          generateScreenRow(canvas, screenTiles);
          drawScreen(canvas, screenTiles);
        };
        for (var i = 0; i < explosions.length; i++) {
          if (explosions[i].explode(ctx)) {
            explosions.shift(i, 1);
          }
        }
        //actor shots
        for (var i = 0; i < shots.length; i++) {
          shots[i].y = shots[i].y - 12;
          if (checkEdgeCollisions(canvas, shots[i])) {
            shots.splice(i, 1);
          }
          else {
            ctx.drawImage(shots[i].img, shots[i].x, shots[i].y);
          }
        }
        //enemy shots
        for (var i = 0; i < enemyShots.length; i++) {
          enemyShots[i].y = enemyShots[i].y + 8;
          if (checkEdgeCollisions(canvas, enemyShots[i])) {
            enemyShots.splice(i, 1);
          }
          else {
            ctx.drawImage(enemyShots[i].img, enemyShots[i].x, enemyShots[i].y);
          }
        }

        if (actor.img.ready) {
          ctx.drawImage(actor.img, actor.x, actor.y);
        };
        for (var i = 0; i < enemies.length; i++) {
          if (checkEdgeCollisionsEnemies(canvas, enemies[i])) {
            enemies.splice(i, 1);
          }
          else {
            enemies[i].move(canvas.width, TILE_SIZE);
            var shot = Math.random()
            if (shot > 0.7 && shot < 0.71) {
              enemies[i].shoot(looperShotImage, enemyShots);
            }
            ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y);
          }
        }
        //check to see if player has collided with an enemy
        for (var i = 0; i < enemies.length; i++) {
          if (boundingBoxCollide(actor, enemies[i])) {
            setTimeout(function() {
              cancelAnimationFrame(loopID);
              actor.die()
              addEventListener('keydown', function(e) {
                if (e.keyCode == 13) {
                  this.removeEventListener('keydown', arguments.callee, false);
                  $('#coverScreen').css('z-index', 1)
                  document.getElementById('coverScreen').width = document.getElementById('coverScreen').width;
                  reset();
                  $('#coverScreen').css('z-index', 1)
                }
              }, false);
            }, 1 * 1)
          }
        }
        for (var i = 0; i < enemyShots.length; i++) {
          if (boundingBoxCollide(actor, enemyShots[i])) {
            setTimeout(function() {
              cancelAnimationFrame(loopID);
              actor.die();
              addEventListener('keydown', function(e) {
                if (e.keyCode == 13) {
                  this.removeEventListener('keydown', arguments.callee, false);
                  $('#coverScreen').css('z-index', 1)
                  document.getElementById('coverScreen').width = document.getElementById('coverScreen').width;
                  reset();
                  $('#coverScreen').css('z-index', 1)
                }
              }, false);
            }, 1 * 1)
          }
        }
        //check if enemies collided with a shot
        for (var i = 0; i < enemies.length; i++) {
          for (var j = 0; j < shots.length; j++) {
            if (boundingBoxCollide(shots[j], enemies[i])) {
              actor.score = actor.score + enemies[i].value;
              explosions.push(new Explosion(enemies[i].x, enemies[i].y));
              enemies.splice(i, 1);
              shots.splice(j, 1);
              document.getElementById('explode').play();
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
        for (var i = 0; i < actor.lives; i++) {
          ctx.drawImage(actor.img, WIDTH - lifeX, 55, 16, 16)
          lifeX = lifeX - 20;
        }
        ctx.restore();
      }



      var reset = function() {
        if ($.jStorage.get('MUTED_MUSIC')) {
          $('#muteMusic').addClass('active');
          document.getElementById('theme').pause();
        }
        else {
          $('#muteMusic').removeClass('active');
          document.getElementById('theme').play();
        };
        if ($.jStorage.get('MUTED_SOUNDS')) {
          $('#muteSounds').addClass('active');
        }
        else {
          $('#muteSounds').removeClass('active');
        };
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
          if (e.keyCode == 32 && shootUp == true) {
            shootUp = false;
            actor.shoot(shootImage, shots);
          }
          else {
            keysDown[e.keyCode] = true;
          }
        }, false);

        addEventListener('keyup', function(e) {
          shootUp = true;
          delete keysDown[e.keyCode];
        }, false);
        draw();
      };

      /**
  Initialize start screen
  */
      initalScreen(canvas);
      addEventListener('keydown', function(e) {
        if (e.keyCode == 13) {
          this.removeEventListener('keydown', arguments.callee, false);
          canvas.width = canvas.width;
          reset();
        }
      }, false);
    });
  });
});