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

<br /><br /><br /><br />

## Features

- Client side QR Code scanning
- Use Browser's Barcode Detector API for hardware accelerated scanning
- Fallback to zbar.wasm (from [undecaf/zbar-wasm](https://github.com/undecaf/zbar-wasm))

<br /><br /><br /><br />

## Development

```bash
pnpm install
pnpm dev
```

Lint and Format

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
