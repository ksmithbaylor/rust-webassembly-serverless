/* tslint:disable */
var wasm;

const stack = [];

const slab = [{ obj: undefined }, { obj: null }, { obj: true }, { obj: false }];

function getObject(idx) {
    if ((idx & 1) === 1) {
        return stack[idx >> 1];
    } else {
        const val = slab[idx >> 1];

        return val.obj;

    }
}

let slab_next = slab.length;

function dropRef(idx) {

    idx = idx >> 1;
    if (idx < 4) return;
    let obj = slab[idx];

    obj.cnt -= 1;
    if (obj.cnt > 0) return;

    // If we hit 0 then free up our space in the slab
    slab[idx] = slab_next;
    slab_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropRef(idx);
    return ret;
}
/**
* @returns {any}
*/
module.exports.handler = function() {
    return takeObject(wasm.handler());
};

function addHeapObject(obj) {
    if (slab_next === slab.length) slab.push(slab.length + 1);
    const idx = slab_next;
    const next = slab[idx];

    slab_next = next;

    slab[idx] = { obj, cnt: 1 };
    return idx << 1;
}

module.exports.__wbg_new_c2b0e8fb9acb3933 = function() {
    return addHeapObject(new Object());
};

const __wbg_set_41792391a5bfdd81_target = (typeof Reflect === 'undefined' ? null : Reflect.set || function() {
    throw new Error(`wasm-bindgen: Reflect.set does not exist`);
}).bind(Reflect);

module.exports.__wbg_set_41792391a5bfdd81 = function(arg0, arg1, arg2) {
    return __wbg_set_41792391a5bfdd81_target(getObject(arg0), getObject(arg1), getObject(arg2)) ? 1 : 0;
};

const __wbg_resolve_ee049d5e96d2f020_target = (typeof Promise === 'undefined' ? null : Promise.resolve || function() {
    throw new Error(`wasm-bindgen: Promise.resolve does not exist`);
}).bind(Promise);

module.exports.__wbg_resolve_ee049d5e96d2f020 = function(arg0) {
    return addHeapObject(__wbg_resolve_ee049d5e96d2f020_target(getObject(arg0)));
};

module.exports.__wbindgen_object_drop_ref = function(i) {
    dropRef(i);
};

const TextDecoder = require('util').TextDecoder;

let cachedTextDecoder = new TextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

module.exports.__wbindgen_string_new = function(p, l) {
    return addHeapObject(getStringFromWasm(p, l));
};

module.exports.__wbindgen_number_new = function(i) {
    return addHeapObject(i);
};

wasm = require('./rust_lambda_bg');
