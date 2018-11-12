
const path = require('path').join(__dirname, 'rust_lambda_bg.wasm');
const bytes = require('fs').readFileSync(path);
let imports = {};
imports['./rust_lambda'] = require('./rust_lambda');

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
