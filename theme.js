const mainTheme = document.getElementById("myAudio");
const demonTheme = document.getElementById("myAudio2");
mainTheme.volume = 0.4
demonTheme.volume = 0.6

let canvas = document.querySelector('canvas')
canvas.addEventListener('click', () => {
  if(score.value < 100) {
    mainTheme.play()
    demonTheme.pause()
  }else{
    mainTheme.pause()
    demonTheme.play()
  }
 
})
