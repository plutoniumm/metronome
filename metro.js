import * as Tone from "https://esm.sh/tone";

const countdown = document.getElementById( "countdown" );
const volume = document.getElementById( "volume" );
const tempo = document.getElementById( "tempo" );

let masterVolume = 50;

const conga = new Tone.MembraneSynth( {
  pitchDecay: 0.02,
  octaves: 8,
  envelope: { attack: 0.0001, decay: 0.2, sustain: 0.0001 / 1000 },
} ).toDestination();

new Tone.Sequence( ( t, p ) => {
  conga.triggerAttack( p, t, Math.random() * 0.5 + 0.5 );
}, [ "F3", "C3b", "F3", "C3b" ], "4n" ).start( 0 );


function updateTempo ( value ) {
  Tone.Transport.bpm.value = value;
  tempo.value = value;
}

function updateVolume ( value ) {
  masterVolume = value / 100;
  Tone.Destination.volume.value = Math.log10( masterVolume ) * 20; // Convert to decibels
  volume.value = value;
}

let countdownTimer;
function startCount ( duration ) {
  let timer = duration, h, m, s;
  countdownTimer = setInterval( () => {
    h = parseInt( timer / 3600, 10 );
    m = parseInt( ( timer % 3600 ) / 60, 10 );
    s = parseInt( timer % 60, 10 );

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    countdown.textContent = `${ h }:${ m }:${ s }`;
    if ( --timer < 0 ) {
      clearInterval( countdownTimer );
      Tone.Transport.stop();
    }
  }, 1000 );
}

function playPause () {
  if ( T.state === "started" ) {
    T.pause();
    clearInterval( countdownTimer );
  } else {
    T.start();
    startCount( 3600 ); // Default 1 hour
  }
}

function stop () {
  T.stop();
  clearInterval( countdownTimer );
  countdown.textContent = "01:00:00";
}

const T = Tone.Transport;
T.bpm.value = 60;
updateVolume( masterVolume )
updateTempo( 60 );

window.playPause = playPause;
window.updateTempo = updateTempo;
window.updateVolume = updateVolume;
window.stop = stop;