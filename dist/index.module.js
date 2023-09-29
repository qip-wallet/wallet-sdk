import*as e from"bitcore-mnemonic";import{initEccLib as t,payments as r,Psbt as n,networks as s,crypto as o}from"bitcoinjs-lib";import*as i from"tiny-secp256k1";import{ECPairFactory as a}from"ecpair";import u from"@mempool/mempool.js";import{bech32m as c,bech32 as h}from"bech32";function f(e,t){try{var r=e()}catch(e){return t(e)}return r&&r.then?r.then(void 0,t):r}function d(e,t,r){if(!e.s){if(r instanceof p){if(!r.s)return void(r.o=d.bind(null,e,t));1&t&&(t=r.s),r=r.v}if(r&&r.then)return void r.then(d.bind(null,e,t),d.bind(null,e,2));e.s=t,e.v=r;const n=e.o;n&&n(e)}}const p=/*#__PURE__*/function(){function e(){}return e.prototype.then=function(t,r){const n=new e,s=this.s;if(s){const e=1&s?t:r;if(e){try{d(n,1,e(this.v))}catch(e){d(n,2,e)}return n}return this}return this.o=function(e){try{const s=e.v;1&e.s?d(n,1,t?t(s):s):r?d(n,1,r(s)):d(n,2,s)}catch(e){d(n,2,e)}},n},e}();t(i);const l=a(i);class m{constructor(){const t=this,o=this,i=this,a=this,m=this,v=this;this.createPassPhrase=()=>{try{return{passPhrase:new e(e.Words.ENGLISH).toString()}}catch(e){throw new Error(e.message)}},this.accountKeys=t=>{try{const r=this.getNetwork(t.networkName);let n=new e(t.passPhrase).toHDPrivateKey(t.passPhrase).derive(`m/44/0/0/0/${t.path}`).privateKey.toString(),s=l.fromPrivateKey(Buffer.from(n.slice(0,32)),{network:r});return{privateKey:s.privateKey.toString(),wif:s.toWIF()}}catch(e){throw new Error(e.message)}},this.createAddress=e=>{try{const t=this.getNetwork(e.networkName);let n,s,o;switch(e.privateKey?n=l.fromPrivateKey(Buffer.from(e.privateKey),{network:t}):e.wif&&(n=l.fromWIF(e.wif,t)),e.addressType){case"taproot":const e=this.tweakSigner(n,{network:t}),i=r.p2tr({pubkey:this.toXOnly(e.publicKey),network:t});s=i.address??"",o=i.output;break;case"legacy":const a=r.p2pkh({pubkey:n.publicKey,network:t});s=a.address??"",o=a.output;break;case"segwit":const u=r.p2wpkh({pubkey:n.publicKey,network:t});s=u.address??"",o=u.output}return{address:s,script:o}}catch(e){console.log(e)}},this.init=function(e){try{const{bitcoin:{addresses:t,fees:r,transactions:n}}=u({hostname:"mempool.space",network:e});return Promise.resolve({addresses:t,fees:r,transactions:n})}catch(e){return Promise.reject(e)}},this.getAddressType=e=>{let{address:t,networkName:r}=e;try{let e;switch(r){case"mainnet":e=this.mainnetAddressType(t,r);break;case"testnet":e=this.testnetAddressType(t)}return null==e?`invalid ${r} address`:e}catch(e){throw new Error(e.message)}},this.getUtxo=function(e){let{networkName:r,address:n}=e;try{return Promise.resolve(f(function(){return Promise.resolve(t.init(r)).then(function(e){let{addresses:t}=e;return Promise.resolve(t.getAddressTxsUtxo({address:n})).then(function(e){return e.map(e=>({txid:e.txid,vout:e.vout,value:e.value}))})})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.getFeeRate=function(e){try{return Promise.resolve(f(function(){return Promise.resolve(o.init(e)).then(function(e){let{fees:t}=e;return Promise.resolve(t.getFeesRecommended())})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.getTransactionDetails=function(e){let{txid:t,networkName:r}=e;try{return Promise.resolve(f(function(){return Promise.resolve(i.init(r)).then(function(e){let{transactions:r}=e;return Promise.resolve(r.getTx({txid:t}))})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.createTransaction=function(e){let{input:t,output:r,addressType:n,networkName:s,feeRate:o,privateKey:i,wif:u}=e;try{return Promise.resolve(f(function(){return Promise.resolve(a.getInputData(n,t,s,i,u)).then(function(e){let c,h=r,f=0,d=0,p=new Map,l=[];if(i){c=a.createAddress({addressType:n,networkName:s,privateKey:i}).address;let e=a.getAddressType({address:c,networkName:s});p.set(e,1)}else if(i){c=a.createAddress({addressType:n,networkName:s,wif:u}).address;let e=a.getAddressType({address:c,networkName:s});p.set(e,1)}t.forEach(e=>{f+=e.value}),r.forEach(e=>{let t=a.getAddressType({address:e.address,networkName:s});d+=e.value,p.has(t)?p.set(t,p.get(t)+1):p.set(t,1)}),p.forEach((e,t)=>{l.push({outputType:t,count:e})});let m=a.getTransactionSize({input:t.length,output:l,addressType:n}),v=m.txBytes*o;if(console.log(v),f-v-d<=550)return new Error("not enough sats in input for transaction");h.push({address:c,value:f-d-v});let w=a.signTransaction({input:e,output:h,addressType:n,networkName:s,privateKey:i});return console.log(w),{input:e,output:h,transactionFee:v,transactionSize:m,totalSpent:d+v}})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.signTransaction=e=>{try{const t=this.getNetwork(e.networkName);let r;e.privateKey?r=l.fromPrivateKey(Buffer.from(e.privateKey),{network:t}):e.wif&&(r=l.fromWIF(e.wif,t)),"taproot"===e.addressType&&(r=this.tweakSigner(r,t));const s=new n({network:t}).addInputs(e.input).addOutputs(e.output).signAllInputs(r).finalizeAllInputs().extractTransaction();return{txHex:s.toHex(),signedTransaction:s}}catch(e){throw new Error(e.message)}},this.createSingleTransaction=function(e){let{receiver:t,amount:r,addressType:n,networkName:s,feeRate:o,privateKey:i,wif:a}=e;try{return Promise.resolve(f(function(){let e,u=[],c=[],h=0,f=new Map,d=[];if(c.push({address:t,value:r}),i){e=m.createAddress({addressType:n,networkName:s,privateKey:i}).address;let t=m.getAddressType({address:e,networkName:s});f.set(t,1)}else if(a){e=m.createAddress({addressType:n,networkName:s,wif:a}).address;let t=m.getAddressType({address:e,networkName:s});f.set(t,1)}return f.forEach((e,t)=>{d.push({outputType:t,count:e})}),Promise.resolve(m.getUtxo({networkName:s,address:e})).then(function(e){for(let t=0;t<e.length;t++){let s=0;u.length>0&&(s=u.length),h+=e[t].value;let i=m.getTransactionSize({input:s,output:d,addressType:n});if(!(h-i.txBytes*o-r<550)){u.push({txid:e[t].txid,vout:e[t].vout,value:e[t].value});break}u.push({txid:e[t].txid,vout:e[t].vout,value:e[t].value})}let t,f=m.getTransactionSize({input:u.length,output:d,addressType:n});if(h<f.txBytes*o+r+550)throw new Error("available balance is not sufficient for transaction");const p=function(){if(i)return Promise.resolve(m.createTransaction({input:u,output:c,addressType:n,networkName:s,feeRate:o,privateKey:i})).then(function(e){t=e});{const e=function(){if(a)return Promise.resolve(m.createTransaction({input:u,output:c,addressType:n,networkName:s,feeRate:o,privateKey:i})).then(function(e){t=e})}();if(e&&e.then)return e.then(function(){})}}();return p&&p.then?p.then(function(){return t}):t})},function(e){throw new Error(e.message)}))}catch(e){return Promise.reject(e)}},this.getInputData=function(e,t,r,n,s){return Promise.resolve(f(function(){return Promise.resolve(v.init(r)).then(function(o){let i,a,{transactions:u}=o,c=v.getNetwork(r);return Promise.resolve(Promise.all(t.map(function(e){try{return Promise.resolve(u.getTx({txid:e.txid})).then(function(t){return{tx:t,vout:e.vout}})}catch(e){return Promise.reject(e)}}))).then(function(r){let o;const h=function(e,t){var r,n=-1;e:{for(var s=0;s<t.length;s++){var o=t[s][0];if(o){var i=o();if(i&&i.then)break e;if(i===e){n=s;break}}else n=s}if(-1!==n){do{for(var a=t[n][1];!a;)n++,a=t[n][1];var u=a();if(u&&u.then){r=!0;break e}var c=t[n][2];n++}while(c&&!c());return u}}const h=new p,f=d.bind(null,h,2);return(r?u.then(l):i.then(function r(i){for(;;){if(i===e){n=s;break}if(++s===t.length){if(-1!==n)break;return void d(h,1,u)}if(o=t[s][0]){if((i=o())&&i.then)return void i.then(r).then(void 0,f)}else n=s}do{for(var a=t[n][1];!a;)n++,a=t[n][1];var u=a();if(u&&u.then)return void u.then(l).then(void 0,f);var c=t[n][2];n++}while(c&&!c());d(h,1,u)})).then(void 0,f),h;function l(e){for(;;){var r=t[n][2];if(!r||r())break;n++;for(var s=t[n][1];!s;)n++,s=t[n][1];if((e=s())&&e.then)return void e.then(l).then(void 0,f)}d(h,1,e)}}(e,[[function(){return"legacy"},function(){return Promise.resolve(Promise.all(t.map(function(e){try{const t=Buffer,r=t.from;return Promise.resolve(u.getTxHex({txid:e.txid})).then(function(n){return{txHex:r.call(t,n,"hex"),hash:e.txid,index:e.vout}})}catch(e){return Promise.reject(e)}}))).then(function(e){a=e.map(function(e){try{return Promise.resolve({hash:e.hash,index:e.index,nonWitnessUtxo:e.txHex})}catch(e){return Promise.reject(e)}}),o=1})}],[function(){return"segwit"},function(){a=r.map(e=>({hash:e.tx.txid,index:e.vout,witnessUtxo:{value:e.tx.vout[e.vout].value,script:Buffer.from(e.tx.vout[e.vout].scriptpubkey,"hex")}})),o=1}],[function(){return"taproot"},function(){n?i=l.fromPrivateKey(Buffer.from(n),{network:c}):s&&(i=l.fromWIF(s,c));let e=v.tweakSigner(i,{network:c});a=r.map(t=>({hash:t.tx.txid,index:t.vout,witnessUtxo:{value:t.tx.vout[t.vout].value,script:Buffer.from(t.tx.vout[t.vout].scriptpubkey,"hex")},tapInternalKey:v.toXOnly(e.publicKey)})),o=1}]]);return h&&h.then?h.then(function(){return a}):a})})},function(){}))},this.getTransactionSize=e=>{let{input:t,output:r,addressType:n}=e;try{const e=148,s=34,o=32,i=67.75,a=31,u=43,c=57.25;let h,f=0,d=0,p=0,l=0;r.forEach(e=>{"P2TR"===e.outputType?p=e.count:"P2WPKH"===e.outputType?d=e.count:"P2TR"===e.outputType?p=e.count:"P2PKH"===e.outputType&&(f=e.count)});let m=0,v=0;switch(n){case"taproot":h="P2TR",m=c,v=108;break;case"segwit":h="P2WPKH",m=i,v=108;break;case"legacy":h="P2PKH",m=e}let w=this.getTxOverheadVBytes(h,t,r.length)+m*t+s*f+a*d+u*p+o*l;return w=Math.ceil(w),{txVBytes:w,txBytes:Math.ceil(this.getTxOverheadExtraRawBytes(h,t)+w+v*t*3/4),txWeight:Math.ceil(4*w)}}catch(e){throw new Error(e.message)}},this.getNetwork=e=>"mainnet"===e?s.bitcoin:"testnet"===e?s.testnet:void 0,this.getKeyPair=(e,t)=>{const r=e.slice(0,32),n=this.getNetwork(t);return l.fromPrivateKey(Buffer.from(r),{network:n})},this.mainnetAddressType=(e,t)=>{try{const r=e.trim();return/^1[0-9A-Za-z]{25,34}$/.test(r)?"P2PKH":/^3[0-9A-Za-z]{25,34}$/.test(r)?"P2SH":1==this.checkTaproot(r,t)?"P2TR":1==this.checkSegwit(r,t)?"P2WPKH":null}catch(e){throw new Error(e.message)}},this.testnetAddressType=e=>{try{const t=e.trim();if(/^m[0-9A-Za-z]{25,34}$/.test(t))return"P2PKH";if(/^2[0-9A-Za-z]{25,34}$/.test(t))return"P2SH";if(/^(tb1|[mn2])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(t)){if(t.startsWith("tb1q"))return"P2WPKH";if(t.startsWith("tb1p"))return"P2TR"}return null}catch(e){throw new Error(e.message)}},this.checkTaproot=(e,t)=>{try{if("mainnet"===t&&e.startsWith("tb1q"))return!1;if("mainnet"===t&&e.startsWith("tb1p"))return!1;if(1===c.decode(e).words[0])return!0}catch(e){return!1}},this.checkSegwit=(e,t)=>{try{if("mainnet"===t&&e.startsWith("tb1q"))return!1;if("mainnet"===t&&e.startsWith("tb1p"))return!1;if(0===h.decode(e).words[0])return!0}catch(e){return!1}},this.getSizeOfScriptLengthElement=e=>e<75?1:e<=255?2:e<=65535?3:e<=4294967295?5:void alert("Size of redeem script is too large"),this.getSizeOfVarInt=e=>{if(e<253)return 1;if(e<65535)return 3;if(e<4294967295)return 5;if(e<0x10000000000000000)return 9;throw new Error("Invalid var int")},this.getTxOverheadVBytes=(e,t,r)=>{if("P2PKH"==e||"P2SH"==e)var n=0;else n=.5+t/4;return 4+this.getSizeOfVarInt(t)+this.getSizeOfVarInt(r)+4+n},this.getTxOverheadExtraRawBytes=(e,t)=>{if("P2PKH"==e||"P2SH"==e)var r=0;else r=.5+t/4;return 3*r}}tweakSigner(e,t){let r=e.privateKey;if(!r)throw new Error("Private key is required for tweaking signer!");3===e.publicKey[0]&&(r=i.privateNegate(r));const n=i.privateAdd(r,this.tapTweakHash(this.toXOnly(e.publicKey),t.tweakHash));if(!n)throw new Error("Invalid tweaked private key!");return l.fromPrivateKey(Buffer.from(n),{network:t.network})}tapTweakHash(e,t){return o.taggedHash("TapTweak",Buffer.concat(t?[e,t]:[e]))}toXOnly(e){return e.subarray(1,33)}}class v extends m{}var w;w=v,[m].forEach(e=>{Object.getOwnPropertyNames(e.prototype).forEach(t=>{Object.defineProperty(w.prototype,t,Object.getOwnPropertyDescriptor(e.prototype,t)||Object.create(null))})});export{v as default};
