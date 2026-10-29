const c = @import("c");

const std = @import("std");
const page_allocator = std.heap.wasm_allocator;

export fn main() callconv(.c) c_int {
    return 0;
}

export fn allocate(size: usize) ?[*]u8 {
    const slice = page_allocator.alloc(u8, size) catch return null;
    return slice.ptr;
}

export fn deallocate(ptr: [*]u8, size: usize) void {
    page_allocator.free(ptr[0..size]);
}

export fn createSymbol() ?*c.zint_symbol {
    return c.ZBarcode_Create();
}

export fn deleteSymbol(symbol: *c.zint_symbol) void {
    c.ZBarcode_Delete(symbol);
}

export fn clearSymbol(symbol: *c.zint_symbol) void {
    c.ZBarcode_Clear(symbol);
}

export fn setSymbology(symbol: *c.zint_symbol, id: c_int) void {
    symbol.symbology = id;
}

export fn setScale(symbol: *c.zint_symbol, scale: f32) void {
    symbol.scale = scale;
}

export fn setOption1(symbol: *c.zint_symbol, val: c_int) void {
    symbol.option_1 = val;
}

export fn setOption2(symbol: *c.zint_symbol, val: c_int) void {
    symbol.option_2 = val;
}

export fn setOption3(symbol: *c.zint_symbol, val: c_int) void {
    symbol.option_3 = val;
}

export fn setInputMode(symbol: *c.zint_symbol, mode: c_int) void {
    symbol.input_mode = mode;
}

export fn setEci(symbol: *c.zint_symbol, eci: c_int) void {
    symbol.eci = eci;
}

export fn setOutputOptions(symbol: *c.zint_symbol, options: c_int) void {
    symbol.output_options = options;
}

export fn setShowHrt(symbol: *c.zint_symbol, val: c_int) void {
    symbol.show_hrt = val;
}

export fn encode(symbol: *c.zint_symbol, data: [*]const u8, length: c_int) c_int {
    return c.ZBarcode_Encode(symbol, data, length);
}

export fn encodeSvg(symbol: *c.zint_symbol, data: [*]const u8, length: c_int) c_int {
    symbol.output_options |= c.BARCODE_MEMORY_FILE;
    @memcpy(symbol.outfile[0..7], "out.svg");
    symbol.outfile[7] = 0;

    const enc_ret = c.ZBarcode_Encode(symbol, data, length);
    if (enc_ret >= 5) return enc_ret;

    return c.ZBarcode_Print(symbol, 0);
}

export fn getErrorText(symbol: *c.zint_symbol) [*]const u8 {
    return &symbol.errtxt;
}

export fn getSvgPtr(symbol: *c.zint_symbol) ?[*]const u8 {
    return symbol.memfile;
}

export fn getSvgLen(symbol: *c.zint_symbol) c_int {
    return symbol.memfile_size;
}

export fn getRows(symbol: *c.zint_symbol) c_int {
    return symbol.rows;
}

export fn getWidth(symbol: *c.zint_symbol) c_int {
    return symbol.width;
}

export fn getModuleData(symbol: *c.zint_symbol) [*]const u8 {
    return @ptrCast(&symbol.encoded_data);
}
