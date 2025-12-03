export function fmt(x) {
  if (!Number.isFinite(x)) return String(x);
  const ax = Math.abs(x);
  if (ax < 1e-12) return '0';
  if (ax >= 1e6 || ax < 1e-4) return x.toExponential(3).replace('+', '');
  return x.toFixed(6).replace(/\.0+$/,'').replace(/(\.[0-9]*?)0+$/,'$1');
}

export const degToRad = d => (d * Math.PI) / 180;
export const radToDeg = r => (r * 180) / Math.PI;

export class Cplx {
  constructor(re = 0, im = 0) { this.re = re; this.im = im; }
  static fromString(s) {
    if (s == null) return new Cplx(0,0);
    const t = s.toString().trim().toLowerCase().replace(/\s+/g,'');
    if (t === '') return new Cplx(0,0);
    // Handle pure imaginary like i, -i, +i
    if (t === 'i' || t === '+i') return new Cplx(0,1);
    if (t === '-i') return new Cplx(0,-1);
    // If contains 'i'
    if (t.includes('i')) {
      // Accept a+bi, a-bi, +bi, -bi, bi
      const m = t.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))?([+-](?:\d+(?:\.\d+)?|\.\d+)?|[+-]?)(?:i)$/);
      if (m) {
        const a = m[1] != null ? Number(m[1]) : 0;
        const ib = m[2];
        let b;
        if (ib === '+' || ib === '') b = 1; else if (ib === '-') b = -1; else b = Number(ib);
        if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('Número inválido');
        return new Cplx(a,b);
      }
      // Or only imaginary like 2.3i, -4i
      const mi = t.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))i$/);
      if (mi) {
        const b = Number(mi[1]);
        if (!Number.isFinite(b)) throw new Error('Número inválido');
        return new Cplx(0,b);
      }
      throw new Error('Formato complexo inválido');
    }
    // Pure real
    const a = Number(t);
    if (!Number.isFinite(a)) throw new Error('Número inválido');
    return new Cplx(a,0);
  }
  add(o) { return new Cplx(this.re + o.re, this.im + o.im); }
  sub(o) { return new Cplx(this.re - o.re, this.im - o.im); }
  mul(o) { return new Cplx(this.re*o.re - this.im*o.im, this.re*o.im + this.im*o.re); }
  div(o) {
    const d = o.re*o.re + o.im*o.im;
    if (d === 0) throw new Error('Divisão por 0 (0+0i)');
    return new Cplx((this.re*o.re + this.im*o.im)/d, (this.im*o.re - this.re*o.im)/d);
  }
  mag() { return Math.hypot(this.re, this.im); }
  phase() { return Math.atan2(this.im, this.re); }
  toRectString() {
    const a = fmt(this.re), b = fmt(Math.abs(this.im));
    const sign = this.im >= 0 ? '+' : '-';
    if (this.im === 0) return `${a}`;
    if (this.re === 0) return `${this.im === -1 ? '-' : (this.im === 1 ? '' : fmt(this.im))}i`.replace('1i','i');
    return `${a} ${sign} ${b}i`;
  }
  toPolarStringDeg() {
    const r = fmt(this.mag());
    const d = fmt(radToDeg(this.phase()));
    return `${r} ∠ ${d}°`;
  }
}
