const fs = require("fs");

// Classic mechanical camera shutter sound
// Sharp click: broadband noise burst with fast decay + mirror slap resonance
const SAMPLE_RATE = 16000;
const DURATION = 0.4;
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

// LCG pseudo-random noise (deterministic, no Math.random drift)
let seed = 123456789;
function noise() {
  seed = (seed * 1664525 + 1013904223) & 0xffffffff;
  return (seed / 0x80000000) - 1;
}

const TWO_PI = 2 * Math.PI;

function shutter(t) {
  // Phase 1: sharp click burst (0–8ms) — broadband noise with fast decay
  const click = Math.exp(-t * 400) * noise() * 0.8;

  // Phase 2: mirror slap resonance (5–80ms) — 1200Hz tone ring-down
  const mirror = Math.exp(-t * 60) * Math.sin(TWO_PI * 1200 * t) * 0.35;

  // Phase 3: shutter close click (150ms) — smaller secondary click
  const t2 = t - 0.15;
  const close = t2 > 0 ? Math.exp(-t2 * 300) * noise() * 0.4 : 0;

  return click + mirror + close;
}

fs.mkdirSync("assets/sounds", { recursive: true });
const path = "assets/sounds/shutter.wav";
fs.writeFileSync(path, makeWav(shutter));
console.log("Generated", path);
