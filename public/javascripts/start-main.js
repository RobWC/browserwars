$(document).ready(function() {
  /**
  setup game globals
	*/
	var MUTED_MUSIC = ($.jStorage.get('MUTED_MUSIC')) ? true : false;
  var MUTED_SOUNDS = ($.jStorage.get('MUTED_SOUNDS')) ? true : false;
  var FRAME_RATE = 60;

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
  if (MUTED_MUSIC) {
    $('#muteMusic').addClass('active');
    document.getElementById('theme').pause();
    document.getElementById('trouble').pause();
  } else {
    $('#muteMusic').removeClass('active');
    document.getElementById('theme').play();
  };

  if (MUTED_SOUNDS) {
    $('#muteSounds').addClass('active');
  } else {
    $('#muteSounds').removeClass('active');
  };

  /**
  Setup sound buttons
  */
	$('#muteSounds').click(function(){
    if (MUTED_SOUNDS) {
      $.jStorage.set('MUTED_SOUNDS', false)
      $('#muteSounds').removeClass('active');
      MUTED_SOUNDS = false;
    } else {
      $.jStorage.set('MUTED_SOUNDS', true)
      $('#muteSounds').addClass('active');
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

  //control sounds
  var playEffect = function(id) {
    if (MUTED_SOUNDS) {
      //dont play the sound
    } else {
      document.getElementById(id).play();
    }
  }

  var reset = function() {
    MUTED_MUSIC = $.jStorage.get('MUTED_MUSIC')
    MUTED_SOUNDS = $.jStorage.get('MUTED_SOUNDS')
    if (MUTED_MUSIC) {
	    $('#muteMusic').addClass('active');
	    document.getElementById('theme').pause();
	    document.getElementById('trouble').pause();
	  } else {
	    $('#muteMusic').removeClass('active');
	    document.getElementById('theme').play();
	  };
	  if (MUTED_SOUNDS) {
	    $('#muteSounds').addClass('active');
	  } else {
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

  /**
  Initialize start screen
  */
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