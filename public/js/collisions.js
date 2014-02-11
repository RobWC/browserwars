var checkEdgeCollisions = function(canvas,item) {
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

var checkEdgeCollisionsEnemies = function(canvas,item) {
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