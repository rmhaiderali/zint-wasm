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
 * ```
 */

/** Options for barcode generation. */
export interface ZintOptions {
  /** Scale factor for SVG output. Default 1. */
  scale?: number;
  /** Symbol-specific option 1 (e.g. ECC level for QR). */
  option1?: number;
  /** Symbol-specific option 2 (e.g. version/size for QR). */
  option2?: number;
  /** Input encoding mode. Default DATA_MODE (0). */
  inputMode?: number;
  /** Whether to render Human Readable Text. Default false for svg(), unset for encode(). */
  showHrt?: boolean;
}

/** Result of SVG barcode generation. */
export interface ZintSvgResult {
  /** Complete SVG document as a string. */
  svg: string;
  /** Width of the barcode in modules. */
  width: number;
  /** Number of rows in the barcode. */
  rows: number;
}

/** Result of raw barcode encoding. */
export interface ZintEncodeResult {
  /** Module data as a flat row-major Uint8Array (rows * width elements). */
  data: Uint8Array;
  /** Width of the barcode in modules. */
  width: number;
  /** Number of rows in the barcode. */
  rows: number;
}

/**
 * WebAssembly wrapper for the zint barcode library.
 *
 * Create an instance with {@linkcode Zint.init}, then call {@linkcode Zint.prototype.svg}
 * or {@linkcode Zint.prototype.encode} to generate barcodes. Symbology constants are
 * available as static properties (e.g. `Zint.QRCODE`, `Zint.MICROQR`).
 */
declare class Zint {
  /**
   * Load the WASM module and create a Zint instance.
   * With no arguments, loads the bundled WASM via `import.meta.url`.
   * @param source URL string, URL object, or raw WASM bytes.
   */
  static init(source?: string | URL | ArrayBuffer | Uint8Array): Promise<Zint>;

  /**
   * Encode data and render as an SVG string.
   * @param symbology Barcode type (use static constants, e.g. `Zint.MICROQR`).
   * @param data Input string to encode.
   * @param options Optional barcode parameters.
   * @throws {Error} If encoding fails (e.g. data too long for symbology).
   */
  svg(symbology: number, data: string, options?: ZintOptions): ZintSvgResult;

  /**
   * Encode data to raw module matrix without rendering.
   * @param symbology Barcode type (use static constants, e.g. `Zint.QRCODE`).
   * @param data Input string to encode.
   * @param options Optional barcode parameters.
   * @throws {Error} If encoding fails.
   */
  encode(symbology: number, data: string, options?: ZintOptions): ZintEncodeResult;

  /** Free the underlying WASM symbol. The instance is unusable after this call. */
  destroy(): void;

  // 1D symbologies
  static readonly CODE11: 1;
  static readonly C25STANDARD: 2;
  static readonly C25INTER: 3;
  static readonly C25IATA: 4;
  static readonly C25LOGIC: 6;
  static readonly C25IND: 7;
  static readonly CODE39: 8;
  static readonly EXCODE39: 9;
  static readonly EANX: 13;
  static readonly EANX_CHK: 14;
  static readonly GS1_128: 16;
  static readonly CODABAR: 18;
  static readonly CODE128: 20;
  static readonly DPLEIT: 21;
  static readonly DPIDENT: 22;
  static readonly CODE16K: 23;
  static readonly CODE49: 24;
  static readonly CODE93: 25;
  static readonly FLAT: 28;
  static readonly DBAR_OMN: 29;
  static readonly DBAR_LTD: 30;
  static readonly DBAR_EXP: 31;
  static readonly TELEPEN: 32;
  static readonly UPCA: 34;
  static readonly UPCA_CHK: 35;
  static readonly UPCE: 37;
  static readonly UPCE_CHK: 38;
  static readonly POSTNET: 40;
  static readonly MSI_PLESSEY: 47;
  static readonly FIM: 49;
  static readonly LOGMARS: 50;
  static readonly PHARMA: 51;
  static readonly PZN: 52;
  static readonly PHARMA_TWO: 53;
  static readonly CODE128AB: 60;
  static readonly ISBNX: 69;
  static readonly PLESSEY: 86;
  static readonly TELEPEN_NUM: 87;
  static readonly ITF14: 89;
  static readonly DPD: 96;
  static readonly CHANNEL: 140;
  static readonly VIN: 73;
  static readonly BC412: 146;

  // 2D symbologies
  static readonly PDF417: 55;
  static readonly PDF417COMP: 56;
  static readonly MAXICODE: 57;
  static readonly QRCODE: 58;
  static readonly DATAMATRIX: 71;
  static readonly CODABLOCKF: 74;
  static readonly MICROPDF417: 84;
  static readonly AZTEC: 92;
  static readonly MICROQR: 97;
  static readonly DOTCODE: 115;
  static readonly HANXIN: 116;
  static readonly CODEONE: 141;
  static readonly GRIDMATRIX: 142;
  static readonly UPNQR: 143;
  static readonly ULTRA: 144;
  static readonly RMQR: 145;

  // Postal symbologies
  static readonly AUSPOST: 63;
  static readonly AUSREPLY: 66;
  static readonly AUSROUTE: 67;
  static readonly AUSREDIRECT: 68;
  static readonly RM4SCC: 70;
  static readonly JAPANPOST: 76;
  static readonly KOREAPOST: 77;
  static readonly PLANET: 82;
  static readonly USPS_IMAIL: 85;
  static readonly KIX: 90;
  static readonly DAFT: 93;
  static readonly MAILMARK_2D: 119;
  static readonly UPU_S10: 120;
  static readonly MAILMARK_4S: 121;

  // GS1 DataBar
  static readonly DBAR_STK: 79;
  static readonly DBAR_OMNSTK: 80;
  static readonly DBAR_EXPSTK: 81;

  // EAN/UPC
  static readonly EAN14: 72;
  static readonly NVE18: 75;

  // HIBC
  static readonly HIBC_128: 98;
  static readonly HIBC_39: 99;
  static readonly HIBC_DM: 102;
  static readonly HIBC_QR: 104;
  static readonly HIBC_PDF: 106;
  static readonly HIBC_MICPDF: 108;
  static readonly HIBC_CODABLOCKF: 110;
  static readonly HIBC_AZTEC: 112;
}

export default Zint;
