const fs = require("fs");

// Classic UK-style double-ring ringtone
// 400Hz + 450Hz dual tone, pattern: 0.4s on, 0.2s off, 0.4s on, 2s off, repeat
const SAMPLE_RATE = 16000;
const DURATION = 4;
const SAMPLES = SAMPLE_RATE * DURATION;
const F1 = 400;
const F2 = 450;

// Ring pattern in seconds: [on, off, on, off]
const PATTERN = [0.4, 0.2, 0.4, 2.0];
const PATTERN_DURATION = PATTERN.reduce((a, b) => a + b, 0);

function isRinging(t) {
  const pos = t % PATTERN_DURATION;
  let acc = 0;
  for (let i = 0; i < PATTERN.length; i++) {
    acc += PATTERN[i];
    if (pos < acc) return i % 2 === 0; // even indices = on
  }
  return false;
}

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
  let sample = 0;
  if (isRinging(t)) {
    // Small attack/release envelope at segment boundaries to avoid clicks
    const posInPattern = t % PATTERN_DURATION;
    let segStart = 0;
    let segLen = 0;
    let acc = 0;
    for (let s = 0; s < PATTERN.length; s++) {
      acc += PATTERN[s];
      if (posInPattern < acc) {
        segLen = PATTERN[s];
        segStart = acc - segLen;
        break;
      }
    }
    const posInSeg = posInPattern - segStart;
    const attack = Math.min(1, posInSeg / 0.01);
    const release = Math.min(1, (segLen - posInSeg) / 0.01);
    const env = Math.min(attack, release);
    sample =
      env * 0.45 * (Math.sin(2 * Math.PI * F1 * t) + Math.sin(2 * Math.PI * F2 * t));
  }
  buf.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
}

fs.mkdirSync("assets/sounds", { recursive: true });
fs.writeFileSync("assets/sounds/ringtone.wav", buf);
console.log("Generated assets/sounds/ringtone.wav");
