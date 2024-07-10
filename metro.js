import * as Tone from "https://esm.sh/tone";

const countdown = document.getElementById( "countdown" );
const volume = document.getElementById( "volume" );
const tempo = document.getElementById( "tempo" );

let masterVolume = 1;

const conga = new Tone.MembraneSynth( {
  pitchDecay: 0.01,
  octaves: 2,
  envelope: { attack: 0.0006, decay: 0.5, sustain: 0 },
} ).toDestination();

const congaPart = new Tone.Sequence( ( t, p ) => {
  conga.triggerAttack( p, t, Math.random() * 0.5 + 0.5 );
}, [ "G3", "G3", "G3", "G3" ], "4n" ).start( 0 );

Tone.Transport.bpm.value = 60;


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
  let timer = duration, hours, minutes, seconds;
  countdownTimer = setInterval( () => {
    hours = parseInt( timer / 3600, 10 );
    minutes = parseInt( ( timer % 3600 ) / 60, 10 );
    seconds = parseInt( timer % 60, 10 );

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    countdown.textContent = `${ hours }:${ minutes }:${ seconds }`;

    if ( --timer < 0 ) {
      clearInterval( countdownTimer );
      Tone.Transport.stop();
    }
  }, 1000 );
}

function playPause () {
  const T = Tone.Transport;
  if ( T.state === "started" ) {
    T.pause();
    clearInterval( countdownTimer );
  } else {
    T.start();
    startCount( 3600 ); // Default 1 hour
  }
}

function stop () {
  const T = Tone.Transport;
  T.stop();
  clearInterval( countdownTimer );
  countdown.textContent = "01:00:00";
}

window.playPause = playPause;
window.updateTempo = updateTempo;
window.updateVolume = updateVolume;
window.stop = stop;