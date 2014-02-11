var attackers = {
  slasher: {
    img: loadImage('/images/Slasher-eye.png'),
    x: 0,
    y: 0,
    type: 'diagonal',
    direction: 'right',
    attack: true,
    value: 20
  },
  looper: {
    img: loadImage('/images/Looper.png'),
    x: 0,
    y: 0,
    type: 's-pattern',
    direction: 'right',
    attack: true,
    value: 10,
    weapons: {
      shoot: {
        active: true,
        img: loadImage('/images/Looper-shot.png')
      }
    }
  },
  rocket: {
    img: loadImage('/images/Rocket.png'),
    x: 0,
    y: 0,
    type: 'rocket',
    direction: 'down',
    attack: false,
    value: 100,
    special: {
      engine: true
    }
  }
};