var state = 'idle';
var waitTimer = null;
var startTimer = null;
var times = [];

var arena = getElementById('arena');
var signal = getElementById('signal');
var msg = getElementById('msg') ;
var sub = getElementById('sub');


function setClass(el, cls){
    el.className =cls;
}

function handleClick () {
    if (state === 'idle' || state === 'result' || state === 'toosoon') {
    beginWait();
  } else if (state === 'waiting') {
    tooSoon();
  } else if (state === 'ready') {
    recordResult();
  }

}

function beginWait{
    clearTimeout(waitTimer);
  state = 'waiting';
 
  setClass(arena, 'state-waiting');
  setClass(signal, 'blue');
 
  msg.innerHTML = 'Get ready…';
  sub.textContent = "Don't click yet!";
  sub.style.display = 'block';
 
  var delay = 1500 + Math.random() * 3500;
  waitTimer = setTimeout(showGo, delay);

}

function showGo{
    state = 'ready';
 
  setClass(arena, 'state-go');
  setClass(signal, 'green');
 
  msg.innerHTML = 'NOW!';
  sub.style.display = 'none';
 
  startTime = performance.now();

}

function tooSoon{
    clearTimeout(waitTimer);
  state = 'toosoon';
 
  setClass(arena, 'state-toosoon');
  setClass(signal, 'red');
 
  msg.innerHTML = 'Too soon!';
  sub.textContent = 'You jumped the gun. Click to try again.';
  sub.style.display = 'block';

}

function recordResult{
    var elapsed = Math.round(performance.now() - startTime);
  state = 'result';
  times.push(elapsed);
 
  setClass(arena, 'state-idle');
  setClass(signal, '');
 
  msg.innerHTML =
    '<div id="big-time">' + elapsed + '</div>' +
    '<div id="time-unit">milliseconds</div>' +
    '<div id="grade">' + grade(elapsed) + '</div>';
 
  sub.textContent = 'Click to go again';
  sub.style.display = 'block';
 
  updateStats();
}


function grade(ms) {
  if (ms < 150) return 'Superhuman';
  if (ms < 200) return 'Lightning fast';
  if (ms < 250) return 'Above average';
  if (ms < 300) return 'Pretty good';
  if (ms < 400) return 'Average';
  return'keep practicing';
             
}



function updateStats() {
  if (times.length === 0) return;
     
  var best = Math.min.apply(null, times);
  var avg  = Math.round(times.reduce(function(a, b) { return a + b; }, 0) / times.length);
          
  document.getElementById('stats-row').classList.remove('hidden');
  document.getElementById('history-wrap').classList.remove('hidden');
  document.getElementById('reset-btn').classList.remove('hidden');
                 
  document.getElementById('s-best').textContent  = best;

  document.getElementById('s-avg').textContent   = avg;
  document.getElementById('s-tries').textContent = times.length;
                        
  drawbars();               
}

function drawBars() {
  var container = document.getElementById('history-bars');
  container.innerHTML = '';
 
  var last  = times.slice(-10);
  var mx    = Math.max.apply(null, last);
  var mn    = Math.min.apply(null, last);
  var range = mx - mn || 1;
 
  last.forEach(function(t, i) {
    var bar = document.createElement('div');
    bar.className = 'bar' + (i === last.length - 1 ? ' latest' : '');
 
    
    var pct = 10 + ((t - mn) / range) * 90;
    bar.style.height = pct.toFixed(1) + '%';
 
    container.appendChild(bar);
  });
}
          

function resetGame() {
  clearTimeout(waitTimer);
  times = [];
  state = 'idle';
 
  setClass(arena, 'state-idle');
  setClass(signal, '');
 
  msg.textContent = 'Click to start';
  sub.textContent = 'Wait for green — then click fast';
  sub.style.display = 'block';
 
  document.getElementById('stats-row').classList.add('hidden');
  document.getElementById('history-wrap').classList.add('hidden');
  document.getElementById('reset-btn').classList.add('hidden');
 
  document.getElementById('s-best').textContent  = '—';
  document.getElementById('s-avg').textContent   = '—';
  document.getElementById('s-tries').textContent = '0';
  document.getElementById('history-bars').innerHTML = '';
}
