const fs = require("fs");

const DTMF = {
  "1": [697, 1209],
  "2": [697, 1336],
  "3": [697, 1477],
  "4": [770, 1209],
  "5": [770, 1336],
  "6": [770, 1477],
  "7": [852, 1209],
  "8": [852, 1336],
  "9": [852, 1477],
  star: [941, 1209],
  "0": [941, 1336],
  hash: [941, 1477],
};

const SAMPLE_RATE = 8000;
const DURATION = 0.12;
const SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

function makeWav(f1, f2) {
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
    const envelope = Math.min(1, Math.min(t / 0.005, (DURATION - t) / 0.01));
    const sample =
      envelope *
      0.45 *
      (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t));
    buf.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
  }
  return buf;
}

fs.mkdirSync("assets/sounds", { recursive: true });

for (const [name, [f1, f2]] of Object.entries(DTMF)) {
  const path = `assets/sounds/dtmf_${name}.wav`;
  fs.writeFileSync(path, makeWav(f1, f2));
  console.log("Generated", path);
}
