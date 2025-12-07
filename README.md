# AM i REAL
**Proof of Reality System**

AM i REAL is a cross-platform system that marks real photos/videos as verifiable originals using cryptographic provenance. It does not replace the camera but secures media immediately after capture.

## Project Structure
- `backend/`: Node.js + Express + SQLite. Handles identity, ledger, and verification logic.
- `web-verifier/`: React + Vite + Tailwind. Public drag-and-drop verification interface.
- `mobile/`: React Native (Expo) + Native Module Stubs (Swift/Kotlin). Simulates the capture and signing pipeline.

## Getting Started

### Prerequisites
- Node.js & npm (v18+)
- Xcode/Android Studio (for mobile native modules)

### Backend
1. `cd backend`
2. `npm install`
3. `npm start`
- Runs on http://localhost:3000

### Web Verifier
1. `cd web-verifier`
2. `npm install`
3. `npm run dev`
- Runs on http://localhost:5173

### Mobile App
1. `cd mobile`
2. `npm install`
3. `npx expo start`
- Note: The native modules for `PHPhotoLibrary` (iOS) and `FileObserver` (Android) are provided as stubs in `mobile/ios` and `mobile/android` for reference. They require a full native project (eacjected Expo or bare React Native) to function.

## Architecture

### The Origin Pipeline
1. **Capture**: User takes photo with native Camera app.
2. **Observe**: Mobile App background service detects new file.
3. **Secure**: 
   - Compute SHA-256 (Content Hash).
   - Compute Perceptual Hash (Similarity).
   - Sign (ContentHash + Timestamp) with Device Private Key (Secure Enclave).
4. **Ledger**: Send signed certificate to Backend.

### Verification Logic
- **Exact Match**: Content Hash matches Ledger. -> `VERIFIED_ORIGINAL`
- **Derived Match**: Content Hash differs, but pHash distance is low. -> `VERIFIED_DERIVED`
- **No Match**: No record found. -> `UNVERIFIED`

## Native Implementation Notes
- **iOS**: Uses `PHPhotoLibraryChangeObserver` to wake app on background capture.
- **Android**: Uses `FileObserver` on DCIM folder.
- **Security**: Keys must be generated in hardware-backed storage (Secure Enclave / Android Keystore) and never leave the device.

## Contact
Designed by Antigravity.
