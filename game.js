/**SELECT CANVAS */
const cvs = document.getElementById('bird')
const ctx = cvs.getContext('2d')

/**GAME VARS AND CONSTS */
let frames = 0

/**LOAD SPRITE IMAGE */
const sprite = new Image()
sprite.src = 'img/sprite.png'

/**GAME STATE */
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
}

/**CONTROL THE GAME */
cvs.addEventListener('click', function(event){
  switch (state.current) {
    case state.getReady:
      state.current = state.game
      break

    case state.game:
      bird.flap()
      break

    case state.over:
      state.current = state.getReady
      break
  
    default:
      break
  }
})

/**BACKGROUND */
const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (this.x + this.w), this.y, this.w, this.h)
  }
}

/**FOREGROUND */
const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,

  draw: function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (this.x + this.w), this.y, this.w, this.h)
  }
}

/**BIRD */
const bird = {
  animation : [
    {sX: 276, sY: 112},
    {sX: 276, sY: 139},
    {sX: 276, sY: 164},
    {sX: 276, sY: 139},
  ],
  w: 34,
  h: 26,
  x: 50,
  y: 150,
  frame: 0,

  draw: function() {
    let bird = this.animation[this.frame]

    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x, this.y, this.w, this.h)
  },

  flap: function() {

  },

  update: function() {
    //if the game state is get ready state, the bird must flap slowly
    this.period = state.current == state.getReady ? 10 : 5

    //we increment the frame by 1, each period
    this.frame += frames % this.period == 0 
      ? 1
      : 0

    //frame goes from 0 to 4, then again to 0
    this.frame = this.frame % this.animation.length
  },
}

/**GET READY MESSAGE */
const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: (cvs.width / 2) - (173 / 2),
  y: 80,

  draw: function() {
    if(state.current == state.getReady)
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
  }
}

/**GAME OVER MESSAGE */
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: (cvs.width / 2) - (225 / 2),
  y: 90,

  draw: function() {
    if(state.current == state.over)
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
  }
}

/**DRAW */
function draw() {
  ctx.fillStyle = "#70C5CE"
  ctx.fillRect(0, 0, cvs.clientWidth, cvs.height)

  bg.draw()
  fg.draw()
  bird.draw()
  getReady.draw()
  gameOver.draw()
}

/**UPDATE */
function update() {
  bird.update()
}

/**LOOP */
function loop() {
  update()
  draw()
  frames++

  requestAnimationFrame(loop)
}
loop()