function playTheme(){
  const music = document.getElementById("myAudio"); 
  music.play();
}

let canvas = document.querySelector('canvas')

canvas.addEventListener('click', (event) => playTheme(event))
document.addEventListener('keyup', (event) => playTheme(event))