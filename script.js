console.clear();

let hydra;

 window.onload = function () {
  hydra = new Hydra({
  height: 720,
  width: 1080,
  canvas: null,
  autoLoop: true, 
  makeGlobal: true, 
  detectAudio: true,
  numSources: 4, 
  numOutputs: 4, 
  extendTransforms: [],
  precision: 'highp',
  pb: null,
})
     
}

// UPDATE: there is a problem in chrome with starting audio context
//  before a user gesture. This fixes it.
var started = null;
window.addEventListener('click', () => {
  if (started) return;
  started = true;
  initialize();
  hydraPlay();
})

function hydraPlay() {
   
 a.show(); 
  s0.initVideo("https://media.giphy.com/media/3oz8xur099boo4N9aU/giphy.mp4");
 
src(s0)
  .invert([1,1])
  .repeatX(100, 0.0)
  .scale(0.5, ()=> 0.5 + a.fft[2])
  .pixelate(1000)
  .out();
  
  // a.hide()
  // shape(3, () => 0.5 + a.fft[0])
  // .scale(0.5, ()=> 0.5 + a.fft[2])
  // .invert([1,1])
  // .repeatX(10, 0.0)
  // .repeatY(10, 0.0)
  // .pixelate(100)
  // .rotate( 109.959, 0 )
  // .out()
}

function initialize() {
  document.body.querySelector('h1').remove();
  const CVS = document.body.querySelector('canvas');
  const CTX = CVS.getContext('2d');
  const W = CVS.width = window.innerWidth;
  const H = CVS.height = window.innerHeight;

  const ACTX = new AudioContext();
  const ANALYSER = ACTX.createAnalyser();

  ANALYSER.fftSize = 4096;  
  
  navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(process);

  function process(stream) {
    const SOURCE = ACTX.createMediaStreamSource(stream);
    SOURCE.connect(ANALYSER);
    const DATA = new Uint8Array(ANALYSER.frequencyBinCount);
    const LEN = DATA.length;
    const h = H / LEN;
    const x = W - 1;
    CTX.fillStyle = 'rgba(255, 255, 255, 0)';

    CTX.fillRect(0, 0, W, H);

    loop();

    function loop() {
      window.requestAnimationFrame(loop);
      let imgData = CTX.getImageData(1, 0, W - 1, H);
      CTX.fillRect(0, 0, W, H);
      CTX.putImageData(imgData, 0, 0);
      ANALYSER.getByteFrequencyData(DATA);
      for (let i = 0; i < LEN; i++) {
        let rat = DATA[i] / 255;
        let hue = 100-(Math.round((rat * 120) + 280 % 360));
        let sat = '0%';
        let lit = 100-(10 + (70 * rat))+ '%';
        CTX.beginPath();
        CTX.strokeStyle = `hsla(${hue}, ${sat}, ${lit}, 0.33)`;
        CTX.moveTo(x, H - (i * h));
        CTX.lineTo(x, H - (i * h + h));
        CTX.stroke();
      }
    }
  }
}
