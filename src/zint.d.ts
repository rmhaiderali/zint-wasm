export interface ZintOptions {
  scale?: number;
  option1?: number;
  option2?: number;
  inputMode?: number;
  showHrt?: boolean;
}

export interface ZintSvgResult {
  svg: string;
  width: number;
  rows: number;
}

export interface ZintEncodeResult {
  data: Uint8Array;
  width: number;
  rows: number;
}

declare class Zint {
  static init(source?: string | URL | ArrayBuffer | Uint8Array): Promise<Zint>;

  svg(symbology: number, data: string, options?: ZintOptions): ZintSvgResult;
  encode(symbology: number, data: string, options?: ZintOptions): ZintEncodeResult;
  destroy(): void;

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
  static readonly PDF417: 55;
  static readonly PDF417COMP: 56;
  static readonly MAXICODE: 57;
  static readonly QRCODE: 58;
  static readonly CODE128AB: 60;
  static readonly AUSPOST: 63;
  static readonly AUSREPLY: 66;
  static readonly AUSROUTE: 67;
  static readonly AUSREDIRECT: 68;
  static readonly ISBNX: 69;
  static readonly RM4SCC: 70;
  static readonly DATAMATRIX: 71;
  static readonly EAN14: 72;
  static readonly VIN: 73;
  static readonly CODABLOCKF: 74;
  static readonly NVE18: 75;
  static readonly JAPANPOST: 76;
  static readonly KOREAPOST: 77;
  static readonly DBAR_STK: 79;
  static readonly DBAR_OMNSTK: 80;
  static readonly DBAR_EXPSTK: 81;
  static readonly PLANET: 82;
  static readonly MICROPDF417: 84;
  static readonly USPS_IMAIL: 85;
  static readonly PLESSEY: 86;
  static readonly TELEPEN_NUM: 87;
  static readonly ITF14: 89;
  static readonly KIX: 90;
  static readonly AZTEC: 92;
  static readonly DAFT: 93;
  static readonly DPD: 96;
  static readonly MICROQR: 97;
  static readonly HIBC_128: 98;
  static readonly HIBC_39: 99;
  static readonly HIBC_DM: 102;
  static readonly HIBC_QR: 104;
  static readonly HIBC_PDF: 106;
  static readonly HIBC_MICPDF: 108;
  static readonly HIBC_CODABLOCKF: 110;
  static readonly HIBC_AZTEC: 112;
  static readonly DOTCODE: 115;
  static readonly HANXIN: 116;
  static readonly MAILMARK_2D: 119;
  static readonly UPU_S10: 120;
  static readonly MAILMARK_4S: 121;
  static readonly CHANNEL: 140;
  static readonly CODEONE: 141;
  static readonly GRIDMATRIX: 142;
  static readonly UPNQR: 143;
  static readonly ULTRA: 144;
  static readonly RMQR: 145;
  static readonly BC412: 146;
}

export default Zint;
