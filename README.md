<div align="center">

  <a href="https://amoshydra.github.io/js-camera/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/c3ec2b02-4c4e-46ad-9cc1-7c45856796f5">
      <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/476e80b4-2d0a-4bbf-927c-3f24b6ddaba0">
      <img alt="JS CAMERA" src="https://github.com/user-attachments/assets/89986c31-d31a-4401-be7d-a882b9e32a62">
    </picture>
  </a>

Web QR Code scanner

[`amoshydra.github.io/js-camera`](https://amoshydra.github.io/js-camera)

</div>

<br /><br />

## Features

- Client-side QR code scanning
- Uses the Browser's Barcode Detector API for hardware-accelerated scanning
- Falls back to zbar.wasm (from [undecaf/zbar-wasm](https://github.com/undecaf/zbar-wasm))
- Screen capture support - Share your screen to scan QR codes displayed on it
- Installable as a PWA for offline use
- On Android, share images directly to this app for QR code decoding

<br /><br />

### Sharing Images (Android)

On Android, share images containing QR codes directly to this app for decoding. This requires installing the app as a PWA on your device.

1. From your browser, install this app as a PWA
2. Launch the app once
3. From your gallery, select an image with a QR code and share it to js-camera

<br /><br />

### Using Screen Capture

Share your screen to scan QR codes displayed on it, instead of pointing your camera at them.

**Enable screen capture:**

1. Open Settings (gear icon)
2. Go to **Camera** section
3. Change **Video source** to **Screen**
4. Select which screen or window to share

Note: Screen capture requires a browser supporting `getDisplayMedia` (Chrome, Edge, Firefox, Safari).

<br /><br /><br /><br />

## Experimental

### AI Vision

An experimental AI-powered visual analysis mode that narrates what's happening in the camera view in real-time.

Enable via Settings > Experimental, then configure your own OpenAI-compatible API endpoint.

For detailed setup instructions, compatible models, configuration options, and troubleshooting, see the [AI Vision Documentation](src/experimental/features/ai/README.md).

<br /><br /><br /><br />

## Development

```bash
pnpm install
pnpm dev
```

Lint and format

```bash
pnpm lint:fix && pnpm fmt:fix
```

<br /><br /><br /><br />

## URL Query Parameters

| Parameter | Values              | Default   | Description                              |
| --------- | ------------------- | --------- | ---------------------------------------- |
| `debug`   | `true`              | `false`   | Show debug overlay with scanning details |
| `scanner` | `browser`, `legacy` | `browser` | Scanner implementation to use            |

### Examples

```
?debug=true                 # Show debug overlay
?scanner=legacy             # Use legacy zbar.wasm scanner
```

- `browser` - Uses Barcode Detector API with hardware acceleration when available, falls back to legacy
- `legacy` - Forces use of zbar.wasm scanner

<br /><br /><br /><br />

<br /><br /><br /><br />
