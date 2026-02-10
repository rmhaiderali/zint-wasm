// @ts-self-types="./zint.d.ts"

/**
 * @module
 *
 * Zint barcode library compiled to WebAssembly.
 * Supports 50+ symbologies including QR, MicroQR, DataMatrix, Code128, Aztec, PDF417, and more.
 * Outputs SVG strings or raw module data for custom rendering.
 *
 * @example Generate an SVG barcode
 * ```ts
 * import Zint from "@zshzebra/zint-wasm";
 *
 * const zint = await Zint.init();
 * const { svg } = zint.svg(Zint.MICROQR, "Hello", { scale: 4 });
 * document.body.innerHTML = svg;
 * ```
 *
 * @example Encode to raw module data
 * ```ts
 * import Zint from "@zshzebra/zint-wasm";
 *
 * const zint = await Zint.init();
 * const { data, width, rows } = zint.encode(Zint.QRCODE, "https://example.com");
 * // data is a Uint8Array of module values, row-major, width*rows elements
 * ```
 *
 * @example Load WASM from a custom path
 * ```ts
 * import Zint from "@zshzebra/zint-wasm";
 *
 * const zint = await Zint.init("/assets/zint.wasm");
 * ```
 */

const SYMBOLOGIES = {
  CODE11: 1,
  C25STANDARD: 2,
  C25INTER: 3,
  C25IATA: 4,
  C25LOGIC: 6,
  C25IND: 7,
  CODE39: 8,
  EXCODE39: 9,
  EANX: 13,
  EANX_CHK: 14,
  GS1_128: 16,
  CODABAR: 18,
  CODE128: 20,
  DPLEIT: 21,
  DPIDENT: 22,
  CODE16K: 23,
  CODE49: 24,
  CODE93: 25,
  FLAT: 28,
  DBAR_OMN: 29,
  DBAR_LTD: 30,
  DBAR_EXP: 31,
  TELEPEN: 32,
  UPCA: 34,
  UPCA_CHK: 35,
  UPCE: 37,
  UPCE_CHK: 38,
  POSTNET: 40,
  MSI_PLESSEY: 47,
  FIM: 49,
  LOGMARS: 50,
  PHARMA: 51,
  PZN: 52,
  PHARMA_TWO: 53,
  PDF417: 55,
  PDF417COMP: 56,
  MAXICODE: 57,
  QRCODE: 58,
  CODE128AB: 60,
  AUSPOST: 63,
  AUSREPLY: 66,
  AUSROUTE: 67,
  AUSREDIRECT: 68,
  ISBNX: 69,
  RM4SCC: 70,
  DATAMATRIX: 71,
  EAN14: 72,
  VIN: 73,
  CODABLOCKF: 74,
  NVE18: 75,
  JAPANPOST: 76,
  KOREAPOST: 77,
  DBAR_STK: 79,
  DBAR_OMNSTK: 80,
  DBAR_EXPSTK: 81,
  PLANET: 82,
  MICROPDF417: 84,
  USPS_IMAIL: 85,
  PLESSEY: 86,
  TELEPEN_NUM: 87,
  ITF14: 89,
  KIX: 90,
  AZTEC: 92,
  DAFT: 93,
  DPD: 96,
  MICROQR: 97,
  HIBC_128: 98,
  HIBC_39: 99,
  HIBC_DM: 102,
  HIBC_QR: 104,
  HIBC_PDF: 106,
  HIBC_MICPDF: 108,
  HIBC_CODABLOCKF: 110,
  HIBC_AZTEC: 112,
  DOTCODE: 115,
  HANXIN: 116,
  MAILMARK_2D: 119,
  UPU_S10: 120,
  MAILMARK_4S: 121,
  CHANNEL: 140,
  CODEONE: 141,
  GRIDMATRIX: 142,
  UPNQR: 143,
  ULTRA: 144,
  RMQR: 145,
  BC412: 146,
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

class Zint {
  #wasm;
  #symbol;

  constructor(wasm) {
    this.#wasm = wasm;
    this.#symbol = wasm.exports.createSymbol();
    if (!this.#symbol) throw new Error("Failed to create zint symbol");
  }

  static async init(source) {
    let bytes;
    if (source instanceof ArrayBuffer || source instanceof Uint8Array) {
      bytes = source;
    } else {
      const url = source || new URL("zint.wasm", import.meta.url);
      const response = await fetch(url);
      bytes = await response.arrayBuffer();
    }
    const wasi = {
      args_get: () => 0,
      args_sizes_get: (argc_ptr, argv_buf_size_ptr) => {
        const view = new DataView(mem());
        view.setUint32(argc_ptr, 0, true);
        view.setUint32(argv_buf_size_ptr, 0, true);
        return 0;
      },
      fd_close: () => 0,
      fd_fdstat_get: () => 0,
      fd_fdstat_set_flags: () => 0,
      fd_prestat_get: () => 8,
      fd_prestat_dir_name: () => 8,
      fd_read: () => 0,
      fd_seek: () => 0,
      fd_write: (fd, iovs_ptr, iovs_len, nwritten_ptr) => {
        const view = new DataView(mem());
        const bytes = new Uint8Array(mem());
        let written = 0;
        for (let i = 0; i < iovs_len; i++) {
          const ptr = view.getUint32(iovs_ptr + i * 8, true);
          const len = view.getUint32(iovs_ptr + i * 8 + 4, true);
          const chunk = bytes.slice(ptr, ptr + len);
          if (fd === 1 || fd === 2) console.log(decoder.decode(chunk));
          written += len;
        }
        view.setUint32(nwritten_ptr, written, true);
        return 0;
      },
      path_create_directory: () => 0,
      path_filestat_get: () => 8,
      path_open: () => 44,
      proc_exit: () => {},
    };
    let instance;
    const mem = () => instance.exports.memory.buffer;
    ({ instance } = await WebAssembly.instantiate(bytes, {
      wasi_snapshot_preview1: wasi,
    }));
    instance.exports._start();
    return new Zint(instance);
  }

  svg(symbology, data, options = {}) {
    const e = this.#wasm.exports;
    const mem = new Uint8Array(e.memory.buffer);

    e.clearSymbol(this.#symbol);
    e.setSymbology(this.#symbol, symbology);
    e.setShowHrt(this.#symbol, 0);

    if (options.scale != null) e.setScale(this.#symbol, options.scale);
    if (options.option1 != null) e.setOption1(this.#symbol, options.option1);
    if (options.option2 != null) e.setOption2(this.#symbol, options.option2);
    if (options.inputMode != null) e.setInputMode(this.#symbol, options.inputMode);
    if (options.showHrt != null) e.setShowHrt(this.#symbol, options.showHrt ? 1 : 0);

    const encoded = encoder.encode(data);
    const ptr = e.allocate(encoded.length);
    if (!ptr) throw new Error("WASM allocation failed");

    new Uint8Array(e.memory.buffer).set(encoded, ptr);

    const ret = e.encodeSvg(this.#symbol, ptr, encoded.length);
    e.deallocate(ptr, encoded.length);

    if (ret >= 5) {
      const errPtr = e.getErrorText(this.#symbol);
      throw new Error(this.#readString(errPtr, 160));
    }

    const svgPtr = e.getSvgPtr(this.#symbol);
    const svgLen = e.getSvgLen(this.#symbol);

    return {
      svg: decoder.decode(new Uint8Array(e.memory.buffer, svgPtr, svgLen)),
      width: e.getWidth(this.#symbol),
      rows: e.getRows(this.#symbol),
    };
  }

  encode(symbology, data, options = {}) {
    const e = this.#wasm.exports;

    e.clearSymbol(this.#symbol);
    e.setSymbology(this.#symbol, symbology);

    if (options.option1 != null) e.setOption1(this.#symbol, options.option1);
    if (options.option2 != null) e.setOption2(this.#symbol, options.option2);
    if (options.inputMode != null) e.setInputMode(this.#symbol, options.inputMode);

    const encoded = encoder.encode(data);
    const ptr = e.allocate(encoded.length);
    if (!ptr) throw new Error("WASM allocation failed");

    new Uint8Array(e.memory.buffer).set(encoded, ptr);

    const ret = e.encode(this.#symbol, ptr, encoded.length);
    e.deallocate(ptr, encoded.length);

    if (ret >= 5) {
      const errPtr = e.getErrorText(this.#symbol);
      throw new Error(this.#readString(errPtr, 160));
    }

    const rows = e.getRows(this.#symbol);
    const width = e.getWidth(this.#symbol);
    const modulePtr = e.getModuleData(this.#symbol);
    const ROW_SIZE = 144;
    const raw = new Uint8Array(e.memory.buffer, modulePtr, 200 * ROW_SIZE);

    const data_out = new Uint8Array(rows * width);
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < width; col++) {
        data_out[r * width + col] = raw[r * ROW_SIZE + col];
      }
    }

    return { data: data_out, width, rows };
  }

  destroy() {
    if (this.#symbol) {
      this.#wasm.exports.deleteSymbol(this.#symbol);
      this.#symbol = null;
    }
  }

  #readString(ptr, maxLen) {
    const bytes = new Uint8Array(this.#wasm.exports.memory.buffer, ptr, maxLen);
    const end = bytes.indexOf(0);
    return decoder.decode(bytes.subarray(0, end === -1 ? maxLen : end));
  }
}

Object.assign(Zint, SYMBOLOGIES);

export default Zint;
