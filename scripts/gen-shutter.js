const fs = require("fs");

// Mechanical camera button click
// Modelled after a manual 35mm SLR: button press thunk → mirror slap → shutter curtain snap → mirror return
const SAMPLE_RATE = 44100;
const DURATION = 0.25;
const SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

function makeWav(generator) {
  const buf = Buffer.alloc(44 + SAMPLES * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + SAMPLES * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(SAMPLES * 2, 40);
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    const sample = Math.max(-1, Math.min(1, generator(t)));
    buf.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  return buf;
}

// Deterministic LCG noise
let seed = 987654321;
function noise() {
  seed = (seed * 1664525 + 1013904223) & 0xffffffff;
  return (seed / 0x80000000) - 1;
}

const TWO_PI = 2 * Math.PI;
const sin = (f, t) => Math.sin(TWO_PI * f * t);

// Simple one-pole low-pass filter state
let lpState = 0;
function lowPass(x, cutoff) {
  const alpha = cutoff / (cutoff + SAMPLE_RATE);
  lpState = lpState + alpha * (x - lpState);
  return lpState;
}

function shutter(t) {
  // 1. Button press thunk: 0–4ms — low, dull plastic/metal impact
  //    Models the button mechanism bottoming out
  const thunkEnv = Math.exp(-t * 900);
  const thunk = thunkEnv * (
    0.5 * sin(280, t) +
    0.3 * sin(520, t) +
    0.6 * noise() * Math.exp(-t * 1800)
  );

  // 2. Mirror slap: 6–35ms — the mirror swings up and hits the mirror box
  const t2 = t - 0.006;
  const mirrorEnv = t2 > 0 ? Math.exp(-t2 * 220) : 0;
  const mirror = mirrorEnv * (
    0.55 * sin(1400 - 600 * t2, t2) +      // descending pitch as mirror settles
    0.25 * sin(2800, t2) +
    0.4 * noise() * Math.exp(-t2 * 600)
  );

  // 3. Shutter curtain: 20–70ms — the fabric/metal curtain firing across the sensor
  //    Modelled as a brief high-freq scrape
  const t3 = t - 0.020;
  const curtainEnv = t3 > 0 ? Math.exp(-t3 * 180) - Math.exp(-t3 * 900) : 0;
  const curtain = curtainEnv * (
    0.35 * noise() +
    0.2 * sin(3200, t3)
  );

  // 4. Mirror return thunk: 120ms — mirror drops back down, softer
  const t4 = t - 0.120;
  const returnEnv = t4 > 0 ? Math.exp(-t4 * 400) : 0;
  const mirrorReturn = returnEnv * (
    0.3 * sin(320, t4) +
    0.25 * noise() * Math.exp(-t4 * 800)
  );

  return thunk + mirror + curtain + mirrorReturn;
}

fs.mkdirSync("assets/sounds", { recursive: true });
const path = "assets/sounds/shutter.wav";
fs.writeFileSync(path, makeWav(shutter));
console.log("Generated", path);
