/**SELECT CANVAS */
/** @type {CanvasRenderingContext2D} */
const cvs = document.getElementById('bird')
/** @type {CanvasRenderingContext2D} */
const ctx = cvs.getContext('2d')

/**GAME VARS AND CONSTS */
let frames = 0
const DEGREE = Math.PI / 180

/**LOAD SPRITE IMAGE */
const sprite = new Image()
sprite.src = 'img/moiayayayay.png'

/**LOAD SOUNDS */
const score_s_audio = new Audio()
score_s_audio.src = "audio/sfx_point.wav"

const flap_audio = new Audio()
flap_audio.src = "audio/sfx_flap.wav"

const hit_audio = new Audio()
hit_audio.src = "audio/sfx_hit.wav"

const swooshing_audio = new Audio()
swooshing_audio.src = "audio/sfx_swooshing.wav"

const die_audio = new Audio()
die_audio.src = "audio/sfx_die.wav"

/**GAME STATE */
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2,
}

/**START BUTTON */
const startBtn = {
  x : 120,
  y : 263,
  w : 83,
  h : 29
}

/**CONTROL THE GAME */
cvs.addEventListener('click', function(event){
  switch (state.current) {
    case state.getReady:
      state.current = state.game
      swooshing_audio.play()
      break

    case state.game:
      bird.flap()
      flap_audio.play()
      break

    case state.over:
      let rect = cvs.getBoundingClientRect()
          let clickX = event.clientX - rect.left
          let clickY = event.clientY - rect.top
          
          // CHECK IF WE CLICK ON THE START BUTTON
          if(clickX >= startBtn.x
              && clickX <= startBtn.x + startBtn.w 
              && clickY >= startBtn.y 
              && clickY <= startBtn.y + startBtn.h) {

              pipes.reset()
              bird.speedReset()
              score.reset()
              state.current = state.getReady
          }
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
  h: 110,
  x: 0,
  y: cvs.height - 110,

  dx: 2,

  draw: function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (this.x + this.w), this.y, this.w, this.h)
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, (this.x + (this.w * 2)), this.y, this.w, this.h)
  },

  update: function() {
    if(state.current == state.game) 
      this.x = (this.x - this.dx) % (this.w)
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

  radius: 12,

  frame: 0,

  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  draw: function() {
    let bird = this.animation[this.frame]

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h)

    ctx.restore()
  },

  flap: function() {
    this.speed =- this.jump
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

    if(state.current == state.getReady) {
      //RESET BIRD POSITION AFTER GAME OVER
      this.y = 150
      this.rotation = 0 * DEGREE

    }else{
      this.speed += this.gravity
      this.y += this.speed

      if(this.y + (this.h / 2) >= cvs.height - fg.h) {
        
        this.y = cvs.height - fg.h - (this.h / 2)
        
        if(state.current == state.game){
          state.current = state.over
          die_audio.play()
        }
      }

      //if reach limit y of canvas
      if(this.y < -10){
        state.current = state.over
        die_audio.play()
      }

      //if the speed is greater than the jump means the bird is falling down
      if(this.speed >= this.jump) {
        this.rotation = 90 * DEGREE
        this.frame = 1
      }else{
        this.rotation = -25 * DEGREE
      }
    }
  },

  speedReset: function() {
    this.speed = 0
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

/**PIPES */
const pipes = {
  position: [],

  top: {
    sX: 553,
    sY: 0,
  },
  bottom: {
    sX: 502,
    sY: 0,
  },

  w: 53,
  h: 400,
  gap: 105,
  maxYPos: -150,
  dx: 2,
  dy: 0,

  draw: function() {
    for(let i  = 0; i < this.position.length; i++){
        let p = this.position[i]
        
        let topYPos = p.y
        let bottomYPos = p.y + this.h + this.gap
        
        //top pipe
        ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h)
        
        //bottom pipe
        ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h) 
    }
  },

  update: function() {
    if(state.current !== state.game) return 
    
    if(frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1)
      })
    }

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i]

      let bottomPipeYPos = p.y + this.h + this.gap

      //COLLISION DETECTION
      //top pipe
      if(bird.x + bird.radius > p.x
        && bird.x - bird.radius < p.x + this.w
        && bird.y + bird.radius > p.y
        && bird.y - bird.radius < p.y + this.h) {
          
          state.current = state.over
          hit_audio.play()
      }
      //bottom pipe
      if(bird.x + bird.radius > p.x
        && bird.x - bird.radius < p.x + this.w
        && bird.y + bird.radius > bottomPipeYPos
        && bird.y - bird.radius < bottomPipeYPos + this.h) {
          
          state.current = state.over
          hit_audio.play()
      }

      //move pipes to the left
      p.x -= this.dx
      p.y += this.dy

      // if the pipes go beyond canvas, we delete them from the array
      if(p.x + this.w <= 0){
        this.position.shift()
        
        score.value += 1
        score_s_audio.play()
        score.best = Math.max(score.value, score.best)
        localStorage.setItem('best', score.best)
      }
    }
  },

  reset: function() {
    this.position = []
  }
}

/**SCORE */
const score = {
  best: parseInt(localStorage.getItem('best')) || 0,
  value: 0,

  draw : function(){
    ctx.fillStyle = "#e0d42b";
    ctx.strokeStyle = "#121212";
    
    if(state.current == state.game){
        ctx.lineWidth = 2;
        ctx.font = "bold 35px Teko";
        ctx.fillText(this.value, cvs.width / 2 -10, 50)
        ctx.strokeText(this.value, cvs.width / 2 -10, 50)
        
    }else if(state.current == state.over){
        // SCORE VALUE
        ctx.font = "bold 25px Teko"
        ctx.fillText(this.value, 225, 186)
        ctx.strokeText(this.value, 225, 186)
        // BEST SCORE
        ctx.fillText(this.best, 225, 228)
        ctx.strokeText(this.best, 225, 228)
    }
  },

  reset: function() {
    this.value = 0
  }
}

/**DIFICULDADE */
const dificult = {

  text: 'Dificuldade: ❑❑❑❑',

  draw: function(){
    ctx.fillStyle = "#121212";
    
    if(state.current !== state.getReady){
      ctx.lineWidth = 2;
      ctx.font = "bold 15px Teko";
      ctx.fillText(this.text, 10, 20)
    }
  },

  update: function(){
    //Dificuldades
    if(score.value < 5){ 
      sprite.src = 'img/moiayayayay.png'
      pipes.gap = 105
      pipes.dx = 2
      fg.dx = 2
      pipes.dy = 0
      this.text = 'Dificuldade: ❑❑❑❑❑❑❑'
    }else if(score.value >= 5 && score.value < 10){
      pipes.gap = 100
      this.text = 'Dificuldade: ◼❑❑❑❑❑❑'
    }else if(score.value >= 10 && score.value < 20){
      pipes.gap = 95
      this.text = 'Dificuldade: ◼◼❑❑❑❑❑'
    }else if(score.value >= 20 && score.value < 30){
      pipes.gap = 90
      this.text = 'Dificuldade: ◼◼◼❑❑❑❑'
    }else if(score.value >= 30 && score.value < 45){
      pipes.gap = 88
      this.text = 'Dificuldade: ◼◼◼◼❑❑❑'
    }else if(score.value >= 45 && score.value < 60){
      pipes.dx = 1.75
      fg.dx = 1.75
      this.text = 'Dificuldade: ◼◼◼◼◼❑❑'
    }else if(score.value >= 60 && score.value < 80){
      pipes.dx = 1.55
      fg.dx = 1.55
      this.text = 'Dificuldade: ◼◼◼◼◼◼❑'
    }else if(score.value >= 80 && score.value < 100){
      pipes.dy = -0.2
      this.text = 'Dificuldade: ◼◼◼◼◼◼◼'
    }else if(score.value >= 100){
      sprite.src = 'img/demonio.png'
      pipes.dy = -0.4
      this.text = 'Dificuldade: Demoníaca ☠'
    }
  }
}


/**MEDALS */
const medal = {
  rarety : [
    {sX: 360, sY: 158}, //bronze
    {sX: 360, sY: 112}, //silver
    {sX: 312, sY: 158}, //gold
    {sX: 312, sY: 112}, //platin
  ],
  w: 44,
  h: 44,
  x: 72,
  y: 176,

  draw: function() {
    if(state.current == state.over){
      if(score.value >= 10){
        let medalDraw = {}

        if(score.value >= 10 && score.value < 20) 
          medalDraw = this.rarety[0]
        else if(score.value >= 20 && score.value < 30) 
          medalDraw = this.rarety[1]
        else if(score.value >= 30 && score.value < 40) 
          medalDraw = this.rarety[2]
        else
          medalDraw = this.rarety[3]

        ctx.drawImage(sprite, medalDraw.sX, medalDraw.sY, this.w, this.h, this.x, this.y, this.w, this.h)
      }
    }
  },
}

/**DRAW */
function draw() {
  ctx.fillStyle = "#70C5CE"
  ctx.fillRect(0, 0, cvs.clientWidth, cvs.height)

  bg.draw()
  pipes.draw()
  fg.draw()
  bird.draw()
  getReady.draw()
  gameOver.draw()
  score.draw()
  dificult.draw()
  medal.draw()
}

/**UPDATE */
function update() {
  bird.update()
  fg.update()
  pipes.update()
  dificult.update()
}

/**LOOP */
function loop() {
  update()
  draw()
  frames++

  requestAnimationFrame(loop)
}
loop()