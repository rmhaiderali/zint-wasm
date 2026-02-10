# zint-wasm

[Zint](https://github.com/zint/zint) barcode library compiled to WebAssembly. Generate 50+ barcode types as SVG or raw module data, in the browser or any JS runtime.

[![JSR](https://jsr.io/badges/@zshzebra/zint-wasm)](https://jsr.io/@zshzebra/zint-wasm)

## Install

```sh
# Deno
deno add jsr:@zshzebra/zint-wasm

# Bun
bunx jsr add @zshzebra/zint-wasm

# npm
npx jsr add @zshzebra/zint-wasm
```

## Usage

```ts
import Zint from "@zshzebra/zint-wasm";

const zint = await Zint.init();

// Generate SVG
const { svg } = zint.svg(Zint.MICROQR, "Hello", { scale: 4 });
document.body.innerHTML = svg;

// Raw module data
const { data, width, rows } = zint.encode(Zint.QRCODE, "https://example.com");
// data: Uint8Array, row-major, width*rows elements
```

### Custom WASM path

```ts
const zint = await Zint.init("/assets/zint.wasm");
```

### Options

```ts
zint.svg(Zint.QRCODE, "data", {
  scale: 4,      // SVG scale factor
  option1: 2,    // ECC level (QR: 1-4)
  option2: 5,    // Version/size
  showHrt: true, // Human Readable Text
});
```

## Supported symbologies

QR Code, MicroQR, RMQR, DataMatrix, Aztec, PDF417, Code128, Code39, EAN/UPC, GS1-128, and [many more](https://www.zint.org.uk/manual/chapter/5). All symbology constants are available as `Zint.QRCODE`, `Zint.MICROQR`, etc.

## Building from source

Requires [Zig](https://ziglang.org/) 0.15+.

```sh
git clone --recurse-submodules https://github.com/zshzebra/zint-wasm.git
cd zint-wasm
zig build
```

Output: `zig-out/bin/zint.wasm`

## License

BSD-3-Clause. Zint backend is also BSD-3-Clause.
