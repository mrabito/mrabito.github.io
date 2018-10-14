var context = new AudioContext();
var buffer = null;
var source1 = context.createBufferSource();
var source2 = context.createBufferSource();
var filter = context.createBiquadFilter();

var request = new XMLHttpRequest();
request.open('GET', 'sounds/wave3.mp3', true);
request.responseType = 'arraybuffer';
request.send();

request.onload =()=> {
  var res = request.response;
  context.decodeAudioData(res, function (buf) {
    source1.buffer = buf;
  });
};
source1.loop = true;

var gainNode = context.createGain();
source1.connect(gainNode);
gainNode.connect(context.destination);
gainNode.gain.value = 0.0;
/*
source1.connect(filter);
filter.connect(context.destination);
filter.type = 'lowpass';
filter.frequency.value = 440;
*/
//source1.connect(context.destination);

source1.start(0);

function changeGain(){
    if(gainNode.gain.value == 1.0){
        gainNode.gain.value = 0.0;
    } else {
        gainNode.gain.value = 1.0;
    };
};
