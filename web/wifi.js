import { Cplx, fmt, degToRad, radToDeg } from './cplx.js';

const a1El = document.getElementById('a1');
const p1El = document.getElementById('p1');
const a2El = document.getElementById('a2');
const p2El = document.getElementById('p2');
const fEl = document.getElementById('freq');
const waves = document.getElementById('waves');
const phasor = document.getElementById('phasor');
const phText = document.getElementById('phasor-text');

const colors = {
  grid: '#1f2630',
  wave1: '#6fc3ff',
  wave2: '#32d296',
  sum: '#ffb86c',
  axes: '#9aa4ad'
};

function drawWaves(A1, phi1, A2, phi2, cycles) {
  const ctx = waves.getContext('2d');
  const w = waves.width, h = waves.height;
  ctx.clearRect(0,0,w,h);
  // grid
  ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
  for (let x=0; x<=w; x+=50) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y=0; y<=h; y+=50) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

  const cx = (t) => t*w;
  const cy = (v) => h/2 - v*(h*0.35);
  const omega = 2*Math.PI*cycles;

  function path(color, fn) {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    for (let i=0;i<=w;i++) {
      const t = i/w;
      const y = fn(t);
      if (i===0) ctx.moveTo(i, cy(y)); else ctx.lineTo(i, cy(y));
    }
    ctx.stroke();
  }

  path(colors.wave1, t => A1*Math.sin(omega*t + phi1));
  path(colors.wave2, t => A2*Math.sin(omega*t + phi2));
  path(colors.sum,   t => A1*Math.sin(omega*t + phi1) + A2*Math.sin(omega*t + phi2));
}

function drawPhasor(A1, phi1, A2, phi2) {
  const ctx = phasor.getContext('2d');
  const w = phasor.width, h = phasor.height; const cx = w/2, cy = h/2;
  ctx.clearRect(0,0,w,h);
  // axes
  ctx.strokeStyle = colors.axes; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(w,cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,h); ctx.stroke();

  const z1 = new Cplx(A1*Math.cos(phi1), A1*Math.sin(phi1));
  const z2 = new Cplx(A2*Math.cos(phi2), A2*Math.sin(phi2));
  const z = z1.add(z2);
  const maxR = Math.max(A1+A2, z.mag(), 1e-6);
  const R = Math.min(w,h)*0.42;
  const k = R / maxR;

  function drawVec(color, z) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
    const x = cx + z.re*k, y = cy - z.im*k;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y); ctx.stroke();
    // arrow head
    const ang = Math.atan2(-(y-cy), x-cx);
    const ah = 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - ah*Math.cos(ang - Math.PI/6), y + ah*Math.sin(ang - Math.PI/6));
    ctx.lineTo(x - ah*Math.cos(ang + Math.PI/6), y + ah*Math.sin(ang + Math.PI/6));
    ctx.closePath(); ctx.fill();
  }

  drawVec(colors.wave1, z1);
  drawVec(colors.wave2, z2);
  drawVec(colors.sum, z);

  phText.textContent = `z₁ = ${z1.toRectString()} = ${z1.toPolarStringDeg()} | z₂ = ${z2.toRectString()} = ${z2.toPolarStringDeg()} | z_sum = ${z.toRectString()} = ${z.toPolarStringDeg()}`;
}

function update() {
  const A1 = Number(a1El.value); const A2 = Number(a2El.value);
  const p1 = degToRad(Number(p1El.value)); const p2 = degToRad(Number(p2El.value));
  const cycles = Number(fEl.value);
  drawWaves(A1, p1, A2, p2, cycles);
  drawPhasor(A1, p1, A2, p2);
}

;[a1El,p1El,a2El,p2El,fEl].forEach(el => el.addEventListener('input', update));
update();
