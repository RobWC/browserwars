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
  };
  return img;
};