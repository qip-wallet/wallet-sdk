import {bitcore, Networks} from "bitcore-lib";
import * as Mnemonic from "bitcore-mnemonic";
import {
    initEccLib,
    networks,
    crypto,
    payments,
    Psbt,
    address,
    script,
} from "bitcoinjs-lib";
import * as tinysecp from "tiny-secp256k1";
import  { ECPairFactory } from "ecpair";
import mempoolJS from "@mempool/mempool.js";
import {bech32m, bech32} from 'bech32';
import { AccountConfig, AddressConfig, Key } from "./types";
import { number } from "bitcoinjs-lib/src/script";
import { testnet } from "bitcoinjs-lib/src/networks";

//const { Networks } = bitcore;
initEccLib(tinysecp);
const ECPair = ECPairFactory(tinysecp);

export class Bitcoin {

  public createPassPhrase = () => {
    try{
      let passPhrase = new Mnemonic(Mnemonic.Words.ENGLISH).toString();
      return{passPhrase: passPhrase}
    }catch(e){
      throw new Error(e.message);
    }
  }

  public accountKeys = (config:AccountConfig):Key =>{
    try{
      const network = this.getNetwork(config.networkName);
      let code = new Mnemonic(config.passPhrase)
      let xpriv = code.toHDPrivateKey(config.passPhrase).derive(`m/44/0/0/0/${config.path}`);
      let privateKey = xpriv.privateKey.toString();
      let keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey.slice(0, 32)), {network});
      
      return {
        privateKey: keyPair.privateKey.toString(),
        wif: keyPair.toWIF()
      };
    }catch(e){
      throw new Error(e.message)
    }
  };

  public createAddress = (config:AddressConfig) => {
    try {
      const network = this.getNetwork(config.networkName);
      let keyPair:any;
      if(config.privateKey){
        keyPair = ECPair.fromPrivateKey(Buffer.from(config.privateKey), {network})
      }else if(config.wif){
        keyPair = ECPair.fromWIF(config.wif, network)
      }
      let address: string;
      let script: Buffer

      switch (config.addressType){
        case "taproot":
          const tweakedSigner = this.tweakSigner(keyPair, { network });
          const p2tr = payments.p2tr({
          pubkey: this.toXOnly(tweakedSigner.publicKey),
          network,
        });
        address = p2tr.address ?? "";
        script = p2tr.output;
        break;
        case "legacy":
          const p2pkh = payments.p2pkh({ pubkey: keyPair.publicKey, network: network })
          address = p2pkh.address ?? "";
          script = p2pkh.output;
        break;
        case "segwit":
          const p2wpkh = payments.p2wpkh({ pubkey: keyPair.publicKey , network: network})
          address = p2wpkh.address ?? "";
          script = p2wpkh.output;
          break
        default:
          return "Invalid address type provided"
      }
      return { address: address, script: script};
    } catch (e) {
      console.log(e);
    }
  };


  public init = async (network: string) => {
    const {
      bitcoin: { addresses, fees, transactions },
    } = mempoolJS({
      hostname: "mempool.space",
      network: network,
    });
  
    return { addresses, fees, transactions };
  };

  public getAddressType = ({address, networkName}: {address:string, networkName:string}) => {
    try{
      let addressType:string
      switch (networkName){
        case "mainnet":
          addressType = this.mainnetAddressType(address, networkName)
          break
        case "testnet":
          addressType = this.testnetAddressType(address)
          break
        default :
          return "Invalid network"
      }

      if(addressType == null) return `invalid ${networkName} address`
      return addressType
    }catch(e){
      throw new Error(e.message)
    }
  }

  //Transaction Methods
  public getUtxo = async (networkName: string, address:string) => {
    try{
      const { addresses } = await this.init(networkName);
      let response = await addresses.getAddressTxsUtxo({ address: address });
      return response;
    }catch(e){
      throw new Error(e.message)
    }
  }

  public getFeeRate = async (networkName:string)=> {
    try{
      let {fees} = await this.init(networkName)
      const feesRecommended = await fees.getFeesRecommended();
      return feesRecommended;
    }catch(e){
      throw new Error(e.message)
    }
  }

  public getTransactionDetails = async (txid: string, networkName: string) => {
    try{
      let {transactions} = await this.init(networkName)
      let txDetails = await transactions.getTx({txid: txid})
      return txDetails
    }catch(e){
      throw new Error(e.message)
    }
  }

  //output = [{outputType: "P2TR", count: 2}, {outputType: "P2PKH", count: 2}]
  public getTransactionSize = ({input, output, addressType}:{input:number, output:any, addressType:string}) => {
    try{
      const P2PKH_IN_SIZE = 148;
      const P2PKH_OUT_SIZE = 34;

      const P2SH_OUT_SIZE = 32;
      const P2SH_P2WPKH_IN_SIZE = 90.75;

      const P2WPKH_IN_SIZE = 67.75;
      const P2WPKH_OUT_SIZE = 31;
      
      const P2TR_OUT_SIZE = 43;
      const P2TR_IN_SIZE = 57.25;
    
      let p2pkh_output_count = 0
      let p2wpkh_output_count = 0
      let p2tr_output_count = 0
      let p2sh_output_count = 0

      output.forEach(element => {
        if(element.outputType === "P2TR"){
          p2tr_output_count = element.count
        }else if(element.outputType === "P2WPKH"){
          p2wpkh_output_count = element.count
        }else if(element.outputType === "P2TR"){
          p2tr_output_count = element.count
        }else if(element.outputType === "P2PKH"){
          p2pkh_output_count = element.count
        }
      });
      
      
      let inputScript;
      let inputSize = 0;
      let inputWitness = 0
      switch (addressType){
        case "taproot":
          inputScript = "P2TR"
          inputSize = P2TR_IN_SIZE
          inputWitness = 108
          break
        case "segwit":
          inputScript = "P2WPKH"
          inputSize = P2WPKH_IN_SIZE
          inputWitness = 108
          break
        case "legacy":
          inputScript = "P2PKH"
          inputSize = P2PKH_IN_SIZE
        default:
          return "Invalid address type provided"
      }

      let txVBytes = this.getTxOverheadVBytes(inputScript, input, output.length) +
                    inputSize * input +
                    P2PKH_OUT_SIZE * p2pkh_output_count +
                    P2WPKH_OUT_SIZE * p2wpkh_output_count +
                    P2TR_OUT_SIZE * p2tr_output_count + 
                    P2SH_OUT_SIZE * p2sh_output_count;
        txVBytes = Math.ceil(txVBytes);

        var txBytes = Math.ceil(this.getTxOverheadExtraRawBytes(inputScript, input) + txVBytes + (inputWitness * input) * 3 / 4);
        var txWeight = Math.ceil(txVBytes * 4);

        return {txVBytes:txVBytes, txBytes:txBytes, txWeight:txWeight}
    }catch(e){
      throw new Error(e.message)
    }
  }

  protected getNetwork = (networkName:string) => {
    if (networkName === "mainnet") {
      return networks.bitcoin;
    } else if (networkName === "testnet") {
      return networks.testnet;
    }
  };
  
  protected getKeyPair = (privateKey, networkName:string) => {
    const p_key = privateKey.slice(0, 32);
    const network = this.getNetwork(networkName);
    return ECPair.fromPrivateKey(Buffer.from(p_key), {
      network,
    });
  };

  //Address validation helpers
  protected mainnetAddressType = (address:string, networkName:string) => {
    try{
        // Remove leading and trailing whitespace
        const trimmedAddress = address.trim();      
        
        // Check for P2PKH (Pay-to-Public-Key-Hash) addresses
        if (/^1[0-9A-Za-z]{25,34}$/.test(trimmedAddress)) {
          return 'P2PKH';
        }
      
        // Check for P2SH (Pay-to-Script-Hash) addresses
        if (/^3[0-9A-Za-z]{25,34}$/.test(trimmedAddress)) {
          return 'P2SH';
        }

        if(this.checkTaproot(trimmedAddress, networkName) == true ){
          return "P2TR"
        }

        if(this.checkSegwit(trimmedAddress, networkName) == true){
          return "P2WPKH"
        }

        return null;
    }catch(e){
      throw new Error(e.message)
    }
  }

  protected testnetAddressType = (address:string) => {
    try{
        const trimmedAddress = address.trim();

        if (/^m[0-9A-Za-z]{25,34}$/.test(trimmedAddress)) {
          return 'P2PKH';
        }
    
        if (/^2[0-9A-Za-z]{25,34}$/.test(trimmedAddress)) {
          return 'P2SH';
        }

        if (/^(tb1|[mn2])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(trimmedAddress)) {
          if (trimmedAddress.startsWith('tb1q')) {
            return 'P2WPKH';
          }
          if (trimmedAddress.startsWith('tb1p')) {
            return 'P2TR';
          }
        }
        return null;
    }catch(e){
      throw new Error(e.message)
    }
  }


  protected checkTaproot = (address: string, networkName:string): boolean => {
    try {
      if(networkName === "mainnet" && address.startsWith("tb1q")) return false
      if(networkName === "mainnet" && address.startsWith("tb1p")) return false
      let isTaproot = bech32m.decode(address).words;
      if(isTaproot[0] === 0x1) return true
    } catch (error) {
      return false;
    }
  }

  protected checkSegwit = (address: string, networkName:string): boolean => {
    try {
      if(networkName === "mainnet" && address.startsWith("tb1q")) return false
      if(networkName === "mainnet" && address.startsWith("tb1p")) return false
      let isSegwit = bech32.decode(address).words;
      if(isSegwit[0] === 0x0) return true
    } catch (error) {
      return false;
    }
  }

  //Taproot Tweek Helpers
  protected tweakSigner(signer:any, opts:any) {
    let privateKey = signer.privateKey;
    if (!privateKey) {
      throw new Error("Private key is required for tweaking signer!");
    }
    if (signer.publicKey[0] === 3) {
      privateKey = tinysecp.privateNegate(privateKey);
    }
  
    const tweakedPrivateKey = tinysecp.privateAdd(
      privateKey,
      this.tapTweakHash(this.toXOnly(signer.publicKey), opts.tweakHash)
    );
    if (!tweakedPrivateKey) {
      throw new Error("Invalid tweaked private key!");
    }
  
    return ECPair.fromPrivateKey(Buffer.from(tweakedPrivateKey), {
      network: opts.network,
    });
  }
  
  protected tapTweakHash(pubKey, h) {
    return crypto.taggedHash(
      "TapTweak",
      Buffer.concat(h ? [pubKey, h] : [pubKey])
    );
  }
  
  protected toXOnly(pubkey) {
    return pubkey.subarray(1, 33);
  }
  
  // Transaction Size Helpers
  protected getSizeOfScriptLengthElement = (length) => {
    if (length < 75) {
      return 1;
    } else if (length <= 255) {
      return 2;
    } else if (length <= 65535) {
      return 3;
    } else if (length <= 4294967295) {
      return 5;
    } else {
      alert('Size of redeem script is too large');
    }
  }
  
  protected getSizeOfVarInt =(length) =>{
    if (length < 253) {
      return 1;
    } else if (length < 65535) {
      return 3;
    } else if (length < 4294967295) {
      return 5;
    } else if (length < 18446744073709551615) {
      return 9;
    } else {
      throw new Error("Invalid var int")
    }
  }

  protected getTxOverheadVBytes = (input_script, input_count, output_count) =>{
    if (input_script == "P2PKH" || input_script == "P2SH") {
      var witness_vbytes = 0;
    } else { // Transactions with segwit inputs have extra overhead
      var witness_vbytes = 0.25                 // segwit marker
                        + 0.25                  // segwit flag
                        + input_count / 4;      // witness element count per input
    }

    return 4 // nVersion
          + this.getSizeOfVarInt(input_count) // number of inputs
          + this.getSizeOfVarInt(output_count) // number of outputs
          + 4 // nLockTime
          + witness_vbytes;
  }

  protected getTxOverheadExtraRawBytes = (input_script, input_count) =>{
    // Returns the remaining 3/4 bytes per witness bytes
    if (input_script == "P2PKH" || input_script == "P2SH") {
      var witness_bytes = 0;
    } else { // Transactions with segwit inputs have extra overhead
      var witness_bytes = 0.25             // segwit marker
                       + 0.25              // segwit flag
                       + input_count / 4;  // witness element count per input
    }

    return witness_bytes * 3;
  }
}

let bitcoin = new Bitcoin()
//console.log(bitcoin.createPassPhrase())
//console.log(bitcoin.createAddress({privateKey: "96346ed8a28b9c0dde05604fcb6169df", networkName:"testnet", addressType: "segwit"}))
//bitcoin.getFeeRate("mainnet").then(res=> console.log(res)).catch()
//console.log(bitcoin.getAddressType({address:"tb1qt0lenzqp8ay0ryehj7m3wwuds240mzhgdhqp4c",networkName: "testnet"}))
//console.log(bitcoin.getTransactionSize({input:5, output:[{outputType: "P2TR", count: 2},{outputType: "P2PKH", count: 2}], addressType: "segwit"}))