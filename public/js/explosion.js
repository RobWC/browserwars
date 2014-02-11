var Explosion = function(x, y) {
  this.x = x;
  this.y = y;
  this.frame = 0;
  this.maxFrame = Math.floor(Math.random() * 40) + 20;
};

Explosion.prototype.explode = function(ctx) {
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
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 8 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 8 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 8 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 8 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 8 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 8 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 8 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 8 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 14 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 14 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 2 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 14 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 2 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 14 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 14 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 14 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 14 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 2 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 14 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 2 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 20 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y + 6 + this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 20 - this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 6 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x + 20 + this.frame / 3, Math.round(Math.random() * 6 + 1) + this.y - 6 - this.frame / 3, this.frame / 8, this.frame / 8)
  ctx.fillRect(Math.round(Math.random() * 6 + 1) + this.x - 20 - this.frame / 3, Math.round(Math.random() * 6 + 1) +this.y + 6 + this.frame / 3, this.frame / 8, this.frame / 8)
  if(this.frame == this.maxFrame) {
    return true;
  } else {
    return false;
  }
};
