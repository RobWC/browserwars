requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app",
      "jquery": "js/lib/jquery"
    }
});
requirejs(["js/main"]);