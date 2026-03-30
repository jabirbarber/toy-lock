# Toy Lock

An Android kiosk app built with Expo that locks the device into a single-app mode — useful for letting kids use a phone without access to system navigation or other apps.

## Features

- **Kiosk mode** — locks the device using Android's screen pinning (Lock Task Mode), disabling the back button, recent apps, and home gesture
- **Auto-lock on launch** — enters kiosk mode immediately when the app is opened
- **Dialpad** — full DTMF dialpad with authentic dial tones and haptic feedback on every key press
- **Long-press-to-toggle** — long press the lock icon to enter or exit kiosk mode

## Tech Stack

- [Expo](https://expo.dev) / React Native
- [expo-kiosk-control](https://www.npmjs.com/package/expo-kiosk-control) — Android Lock Task Mode
- [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) — DTMF tone playback
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptic feedback
- [react-native-paper](https://reactnativepaper.com/) — UI components (MD3 dark theme)

## Getting Started

### Prerequisites

- Node.js 18+
- [EAS CLI](https://docs.expo.dev/eas/) for building
- An Android device or emulator

### Install dependencies

```bash
npm install
```

### Run in development

Install the development build APK on your device, then:

```bash
npx expo start
```

### Build a shareable APK

```bash
eas build --profile preview --platform android
```

### Build a development APK

```bash
eas build --profile development --platform android
```

## Project Structure

```
app/
  index.tsx         # Main kiosk screen
  _layout.tsx       # Root layout with PaperProvider
components/
  UIDialpad.tsx     # DTMF dialpad with tones and haptics
  UIButtonIcon.tsx  # Pressable icon button
constants/
  theme.ts          # Colours, spacing scale
  device.ts         # Device dimensions
assets/
  sounds/           # Generated DTMF WAV files
```

## Notes

- Kiosk mode uses Android **screen pinning** — no Device Owner setup required
- The fingerprint/PIN prompt on unlock and the "App is pinned" popup are Android system behaviours that cannot be suppressed without Device Owner provisioning
- DTMF tones are generated programmatically via `scripts/gen-dtmf.js` using standard ITU-T frequencies
