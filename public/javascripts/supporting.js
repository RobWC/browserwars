var getBrowserName = function(random) {
  if (!!random) {
    if (random > 0.0 && random < 0.2) {
      return new browserChar(browser.chrome);
    } else if (random > 0.0 && random < 0.3) {
      return new browserChar(browser.firefox);
    } else if (random > 0.3 && random < 0.6) {
      return new browserChar(browser.safari);
    } else if (random > 0.6 && random < 0.7) {
      return new browserChar(browser.opera);
    } else if (random > 0.7 && random < 1) {
      return new browserChar(browser.ie);
    };
  };
  var userAgent = navigator.userAgent;  
  var chromeMatch = browser.chrome.regex.exec(userAgent);
  var firefoxMatch = browser.firefox.regex.exec(userAgent);
  var safariMatch = browser.safari.regex.exec(userAgent);
  var operaMatch = browser.opera.regex.exec(userAgent);
  var ieMatch = browser.ie.regex.exec(userAgent);
  if (chromeMatch != null && chromeMatch.length > 1) {
      return new browserChar(browser.chrome);
  } else if (firefoxMatch != null && firefoxMatch.length > 1) {
      return new browserChar(browser.firefox);
  } else if (safariMatch != null && operaMatch == null && safariMatch.length > 1) {
      return new browserChar(browser.safari);
  } else if (operaMatch != null && operaMatch.length > 1) {
      return new browserChar(browser.opera);
  } else if (ieMatch != null && ieMatch.length > 1) {
      return new browserChar(browser.ie);
  } else {
      return new browserChar(browser.other);
  }
};

var loadImage = function(src) {
  var img = new Image();
  img.src = src;
  img.ready = false;
  img.onload = function () {
    this.ready = true;
  }
  return img;
};
 
function spawn(enemies) {
   var random = Math.random();
   if (random > 0.0 && random < 0.01) {
     enemies.push(new Enemy(attackers.slasher)); 
   } else if ( random > 0.02 && random < 0.03) {
     enemies.push(new Enemy(attackers.looper));   
   } else if (random > 0.05 && random < 0.06) {
     enemies.push(new Enemy(attackers.rocket));
   };
}

function boundingBoxCollide(object1, object2) {
   var left1 = object1.x;
   var left2 = object2.x;
   var right1 = object1.x + object1.img.width / 1.2;
   var right2 = object2.x + object2.img.width / 1.2;
   var top1 = object1.y;
   var top2 = object2.y;
   var bottom1 = object1.y + object1.img.height / 1.2;
   var bottom2 = object2.y + object2.img.height / 1.2;
   if (bottom1 < top2) return(false);
   if (top1 > bottom2) return(false);
   if (right1 < left2) return(false);
   if (left1 > right2) return(false);
   return(true);
};