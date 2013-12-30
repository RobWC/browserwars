requirejs.config({
    "baseUrl": "js",
    "paths": {
      "app": "../app",
      "jquery": "/javascrips/jquery.js"
    }
});
requirejs(["javascripts/main"]);