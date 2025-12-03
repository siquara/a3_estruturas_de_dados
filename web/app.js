import { Cplx, fmt, radToDeg } from './cplx.js';

const form = document.getElementById('calc-form');
const z1El = document.getElementById('z1');
const z2El = document.getElementById('z2');
const opEl = document.getElementById('op');
const swapBtn = document.getElementById('swap');

const resRect = document.getElementById('res-rect');
const resRectBreakdown = document.getElementById('res-rect-breakdown');
const resPolar = document.getElementById('res-polar');
const resPolarBreakdown = document.getElementById('res-polar-breakdown');

swapBtn.addEventListener('click', () => {
  const t = z1El.value; z1El.value = z2El.value; z2El.value = t;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const z1 = Cplx.fromString(z1El.value);
    const z2 = Cplx.fromString(z2El.value);
    let r;
    switch (opEl.value) {
      case 'add': r = z1.add(z2); break;
      case 'sub': r = z1.sub(z2); break;
      case 'mul': r = z1.mul(z2); break;
      case 'div': r = z1.div(z2); break;
      default: throw new Error('Operação inválida');
    }
    resRect.textContent = r.toRectString();
    resRectBreakdown.textContent = `Re = ${fmt(r.re)}, Im = ${fmt(r.im)}`;
    resPolar.textContent = r.toPolarStringDeg();
    resPolarBreakdown.textContent = `|z| = ${fmt(r.mag())}, θ = ${fmt(radToDeg(r.phase()))}°`;
  } catch (err) {
    resRect.textContent = '—';
    resRectBreakdown.textContent = err.message;
    resPolar.textContent = '—';
    resPolarBreakdown.textContent = '—';
  }
});
