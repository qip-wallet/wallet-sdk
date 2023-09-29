!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("bitcore-mnemonic"),require("bitcoinjs-lib"),require("tiny-secp256k1"),require("ecpair"),require("@mempool/mempool.js"),require("bech32")):"function"==typeof define&&define.amd?define(["bitcore-mnemonic","bitcoinjs-lib","tiny-secp256k1","ecpair","@mempool/mempool.js","bech32"],t):(e||self).qipWalletSdk=t(e.bitcoreMnemonic,e.bitcoinjsLib,e.tinySecp256K1,e.ecpair,e.mempoolJS,e.bech32)}(this,function(e,t,r,n,o,i){function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function s(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach(function(r){if("default"!==r){var n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return e[r]}})}}),t.default=e,t}var u=/*#__PURE__*/s(e),c=/*#__PURE__*/s(r),f=/*#__PURE__*/a(o);function d(e,t){return d=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},d(e,t)}function h(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}function p(e,t,r){if(!e.s){if(r instanceof v){if(!r.s)return void(r.o=p.bind(null,e,t));1&t&&(t=r.s),r=r.v}if(r&&r.then)return void r.then(p.bind(null,e,t),p.bind(null,e,2));e.s=t,e.v=r;var n=e.o;n&&n(e)}}var v=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,r){var n=new e,o=this.s;if(o){var i=1&o?t:r;if(i){try{p(n,1,i(this.v))}catch(e){p(n,2,e)}return n}return this}return this.o=function(e){try{var o=e.v;1&e.s?p(n,1,t?t(o):o):r?p(n,1,r(o)):p(n,2,o)}catch(e){p(n,2,e)}},n},e}();t.initEccLib(c);var l,y=n.ECPairFactory(c),m=/*#__PURE__*/function(){function e(){var e=this,r=this,n=this,o=this,a=this,s=this,c=this;this.createPassPhrase=function(){try{return{passPhrase:new u(u.Words.ENGLISH).toString()}}catch(e){throw new Error(e.message)}},this.accountKeys=function(e){try{var t=c.getNetwork(e.networkName),r=new u(e.passPhrase).toHDPrivateKey(e.passPhrase).derive("m/44/0/0/0/"+e.path).privateKey.toString(),n=y.fromPrivateKey(Buffer.from(r.slice(0,32)),{network:t});return{privateKey:n.privateKey.toString(),wif:n.toWIF()}}catch(e){throw new Error(e.message)}},this.createAddress=function(e){var r,n,o;try{var i,a,s,u=c.getNetwork(e.networkName);switch(e.privateKey?i=y.fromPrivateKey(Buffer.from(e.privateKey),{network:u}):e.wif&&(i=y.fromWIF(e.wif,u)),e.addressType){case"taproot":var f=c.tweakSigner(i,{network:u}),d=t.payments.p2tr({pubkey:c.toXOnly(f.publicKey),network:u});a=null!=(r=d.address)?r:"",s=d.output;break;case"legacy":var h=t.payments.p2pkh({pubkey:i.publicKey,network:u});a=null!=(n=h.address)?n:"",s=h.output;break;case"segwit":var p=t.payments.p2wpkh({pubkey:i.publicKey,network:u});a=null!=(o=p.address)?o:"",s=p.output}return{address:a,script:s}}catch(e){console.log(e)}},this.init=function(e){try{var t=f.default({hostname:"mempool.space",network:e}).bitcoin;return Promise.resolve({addresses:t.addresses,fees:t.fees,transactions:t.transactions})}catch(e){return Promise.reject(e)}},this.getAddressType=function(e){var t=e.address,r=e.networkName;try{var n;switch(r){case"mainnet":n=c.mainnetAddressType(t,r);break;case"testnet":n=c.testnetAddressType(t)}return null==n?"invalid "+r+" address":n}catch(e){throw new Error(e.message)}},this.getUtxo=function(t){var r=t.networkName,n=t.address;try{return Promise.resolve(h(function(){return Promise.resolve(e.init(r)).then(function(e){return Promise.resolve(e.addresses.getAddressTxsUtxo({address:n})).then(function(e){return e.map(function(e){return{txid:e.txid,vout:e.vout,value:e.value}})})})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.getFeeRate=function(e){try{return Promise.resolve(h(function(){return Promise.resolve(r.init(e)).then(function(e){return Promise.resolve(e.fees.getFeesRecommended())})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.getTransactionDetails=function(e){var t=e.txid,r=e.networkName;try{return Promise.resolve(h(function(){return Promise.resolve(n.init(r)).then(function(e){return Promise.resolve(e.transactions.getTx({txid:t}))})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.createTransaction=function(e){var t=e.input,r=e.output,n=e.addressType,i=e.networkName,a=e.feeRate,s=e.privateKey,u=e.wif;try{return Promise.resolve(h(function(){return Promise.resolve(o.getInputData(n,t,i,s,u)).then(function(e){var c,f=r,d=0,h=0,p=new Map,v=[];if(s){c=o.createAddress({addressType:n,networkName:i,privateKey:s}).address;var l=o.getAddressType({address:c,networkName:i});p.set(l,1)}else if(s){c=o.createAddress({addressType:n,networkName:i,wif:u}).address;var y=o.getAddressType({address:c,networkName:i});p.set(y,1)}t.forEach(function(e){d+=e.value}),r.forEach(function(e){var t=o.getAddressType({address:e.address,networkName:i});h+=e.value,p.has(t)?p.set(t,p.get(t)+1):p.set(t,1)}),p.forEach(function(e,t){v.push({outputType:t,count:e})});var m=o.getTransactionSize({input:t.length,output:v,addressType:n}),w=m.txBytes*a;if(console.log(w),d-w-h<=550)return new Error("not enough sats in input for transaction");f.push({address:c,value:d-h-w});var g=o.signTransaction({input:e,output:f,addressType:n,networkName:i,privateKey:s});return console.log(g),{input:e,output:f,transactionFee:w,transactionSize:m,totalSpent:h+w}})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.signTransaction=function(e){try{var r,n=c.getNetwork(e.networkName);e.privateKey?r=y.fromPrivateKey(Buffer.from(e.privateKey),{network:n}):e.wif&&(r=y.fromWIF(e.wif,n)),"taproot"===e.addressType&&(r=c.tweakSigner(r,n));var o=new t.Psbt({network:n}).addInputs(e.input).addOutputs(e.output).signAllInputs(r).finalizeAllInputs().extractTransaction();return{txHex:o.toHex(),signedTransaction:o}}catch(e){throw new Error(e.message)}},this.createSingleTransaction=function(e){var t=e.receiver,r=e.amount,n=e.addressType,o=e.networkName,i=e.feeRate,s=e.privateKey,u=e.wif;try{return Promise.resolve(h(function(){var e,c=[],f=[],d=0,h=new Map,p=[];if(f.push({address:t,value:r}),s){e=a.createAddress({addressType:n,networkName:o,privateKey:s}).address;var v=a.getAddressType({address:e,networkName:o});h.set(v,1)}else if(u){e=a.createAddress({addressType:n,networkName:o,wif:u}).address;var l=a.getAddressType({address:e,networkName:o});h.set(l,1)}return h.forEach(function(e,t){p.push({outputType:t,count:e})}),Promise.resolve(a.getUtxo({networkName:o,address:e})).then(function(e){for(var t=0;t<e.length;t++){var h=0;c.length>0&&(h=c.length),d+=e[t].value;var v=a.getTransactionSize({input:h,output:p,addressType:n});if(!(d-v.txBytes*i-r<550)){c.push({txid:e[t].txid,vout:e[t].vout,value:e[t].value});break}c.push({txid:e[t].txid,vout:e[t].vout,value:e[t].value})}var l,y=a.getTransactionSize({input:c.length,output:p,addressType:n});if(d<y.txBytes*i+r+550)throw new Error("available balance is not sufficient for transaction");var m=function(){if(s)return Promise.resolve(a.createTransaction({input:c,output:f,addressType:n,networkName:o,feeRate:i,privateKey:s})).then(function(e){l=e});var e=function(){if(u)return Promise.resolve(a.createTransaction({input:c,output:f,addressType:n,networkName:o,feeRate:i,privateKey:s})).then(function(e){l=e})}();return e&&e.then?e.then(function(){}):void 0}();return m&&m.then?m.then(function(){return l}):l})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.getInputData=function(e,t,r,n,o){return Promise.resolve(h(function(){return Promise.resolve(s.init(r)).then(function(i){var a,u,c=i.transactions,f=s.getNetwork(r);return Promise.resolve(Promise.all(t.map(function(e){try{return Promise.resolve(c.getTx({txid:e.txid})).then(function(t){return{tx:t,vout:e.vout}})}catch(e){return Promise.reject(e)}}))).then(function(r){var i=function(e,t){var r,n=-1;e:{for(var o=0;o<t.length;o++){var i=t[o][0];if(i){var a=i();if(a&&a.then)break e;if(a===e){n=o;break}}else n=o}if(-1!==n){do{for(var s=t[n][1];!s;)n++,s=t[n][1];var u=s();if(u&&u.then){r=!0;break e}var c=t[n][2];n++}while(c&&!c());return u}}var f=new v,d=p.bind(null,f,2);return(r?u.then(h):a.then(function r(a){for(;;){if(a===e){n=o;break}if(++o===t.length){if(-1!==n)break;return void p(f,1,u)}if(i=t[o][0]){if((a=i())&&a.then)return void a.then(r).then(void 0,d)}else n=o}do{for(var s=t[n][1];!s;)n++,s=t[n][1];var u=s();if(u&&u.then)return void u.then(h).then(void 0,d);var c=t[n][2];n++}while(c&&!c());p(f,1,u)})).then(void 0,d),f;function h(e){for(;;){var r=t[n][2];if(!r||r())break;n++;for(var o=t[n][1];!o;)n++,o=t[n][1];if((e=o())&&e.then)return void e.then(h).then(void 0,d)}p(f,1,e)}}(e,[[function(){return"legacy"},function(){return Promise.resolve(Promise.all(t.map(function(e){try{var t=Buffer,r=t.from;return Promise.resolve(c.getTxHex({txid:e.txid})).then(function(n){return{txHex:r.call(t,n,"hex"),hash:e.txid,index:e.vout}})}catch(e){return Promise.reject(e)}}))).then(function(e){u=e.map(function(e){try{return Promise.resolve({hash:e.hash,index:e.index,nonWitnessUtxo:e.txHex})}catch(e){return Promise.reject(e)}})})}],[function(){return"segwit"},function(){u=r.map(function(e){return{hash:e.tx.txid,index:e.vout,witnessUtxo:{value:e.tx.vout[e.vout].value,script:Buffer.from(e.tx.vout[e.vout].scriptpubkey,"hex")}}})}],[function(){return"taproot"},function(){n?a=y.fromPrivateKey(Buffer.from(n),{network:f}):o&&(a=y.fromWIF(o,f));var e=s.tweakSigner(a,{network:f});u=r.map(function(t){return{hash:t.tx.txid,index:t.vout,witnessUtxo:{value:t.tx.vout[t.vout].value,script:Buffer.from(t.tx.vout[t.vout].scriptpubkey,"hex")},tapInternalKey:s.toXOnly(e.publicKey)}})}]]);return i&&i.then?i.then(function(){return u}):u})})},function(){}))},this.getTransactionSize=function(e){var t=e.input,r=e.output,n=e.addressType;try{var o,i=0,a=0,s=0;r.forEach(function(e){"P2TR"===e.outputType?s=e.count:"P2WPKH"===e.outputType?a=e.count:"P2TR"===e.outputType?s=e.count:"P2PKH"===e.outputType&&(i=e.count)});var u=0,f=0;switch(n){case"taproot":o="P2TR",u=57.25,f=108;break;case"segwit":o="P2WPKH",u=67.75,f=108;break;case"legacy":o="P2PKH",u=148}var d=c.getTxOverheadVBytes(o,t,r.length)+u*t+34*i+31*a+43*s+0;return{txVBytes:d=Math.ceil(d),txBytes:Math.ceil(c.getTxOverheadExtraRawBytes(o,t)+d+f*t*3/4),txWeight:Math.ceil(4*d)}}catch(e){throw new Error(e.message)}},this.getNetwork=function(e){return"mainnet"===e?t.networks.bitcoin:"testnet"===e?t.networks.testnet:void 0},this.getKeyPair=function(e,t){var r=e.slice(0,32),n=c.getNetwork(t);return y.fromPrivateKey(Buffer.from(r),{network:n})},this.mainnetAddressType=function(e,t){try{var r=e.trim();return/^1[0-9A-Za-z]{25,34}$/.test(r)?"P2PKH":/^3[0-9A-Za-z]{25,34}$/.test(r)?"P2SH":1==c.checkTaproot(r,t)?"P2TR":1==c.checkSegwit(r,t)?"P2WPKH":null}catch(e){throw new Error(e.message)}},this.testnetAddressType=function(e){try{var t=e.trim();if(/^m[0-9A-Za-z]{25,34}$/.test(t))return"P2PKH";if(/^2[0-9A-Za-z]{25,34}$/.test(t))return"P2SH";if(/^(tb1|[mn2])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(t)){if(t.startsWith("tb1q"))return"P2WPKH";if(t.startsWith("tb1p"))return"P2TR"}return null}catch(e){throw new Error(e.message)}},this.checkTaproot=function(e,t){try{if("mainnet"===t&&e.startsWith("tb1q"))return!1;if("mainnet"===t&&e.startsWith("tb1p"))return!1;if(1===i.bech32m.decode(e).words[0])return!0}catch(e){return!1}},this.checkSegwit=function(e,t){try{if("mainnet"===t&&e.startsWith("tb1q"))return!1;if("mainnet"===t&&e.startsWith("tb1p"))return!1;if(0===i.bech32.decode(e).words[0])return!0}catch(e){return!1}},this.getSizeOfScriptLengthElement=function(e){return e<75?1:e<=255?2:e<=65535?3:e<=4294967295?5:void alert("Size of redeem script is too large")},this.getSizeOfVarInt=function(e){if(e<253)return 1;if(e<65535)return 3;if(e<4294967295)return 5;if(e<0x10000000000000000)return 9;throw new Error("Invalid var int")},this.getTxOverheadVBytes=function(e,t,r){if("P2PKH"==e||"P2SH"==e)var n=0;else n=.5+t/4;return 4+c.getSizeOfVarInt(t)+c.getSizeOfVarInt(r)+4+n},this.getTxOverheadExtraRawBytes=function(e,t){if("P2PKH"==e||"P2SH"==e)var r=0;else r=.5+t/4;return 3*r}}var r=e.prototype;return r.tweakSigner=function(e,t){var r=e.privateKey;if(!r)throw new Error("Private key is required for tweaking signer!");3===e.publicKey[0]&&(r=c.privateNegate(r));var n=c.privateAdd(r,this.tapTweakHash(this.toXOnly(e.publicKey),t.tweakHash));if(!n)throw new Error("Invalid tweaked private key!");return y.fromPrivateKey(Buffer.from(n),{network:t.network})},r.tapTweakHash=function(e,r){return t.crypto.taggedHash("TapTweak",Buffer.concat(r?[e,r]:[e]))},r.toXOnly=function(e){return e.subarray(1,33)},e}(),w=/*#__PURE__*/function(e){var t,r;function n(){return e.apply(this,arguments)||this}return r=e,(t=n).prototype=Object.create(r.prototype),t.prototype.constructor=t,d(t,r),n}(m);return l=w,[m].forEach(function(e){Object.getOwnPropertyNames(e.prototype).forEach(function(t){Object.defineProperty(l.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t)||Object.create(null))})}),w});
