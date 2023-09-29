/// <reference types="node" />
import { networks } from "bitcoinjs-lib";
import { AccountConfig, AddressConfig, Key, TransactionDetails } from "./types";
export declare class Bitcoin {
    createPassPhrase: () => {
        passPhrase: any;
    };
    accountKeys: (config: AccountConfig) => Key;
    createAddress: (config: AddressConfig) => {
        address: string;
        script: Buffer;
    };
    init: (network: string) => Promise<{
        addresses: import("@mempool/mempool.js/lib/interfaces/bitcoin/addresses").AddressInstance;
        fees: import("@mempool/mempool.js/lib/interfaces/bitcoin/fees").FeeInstance;
        transactions: import("@mempool/mempool.js/lib/interfaces/bitcoin/transactions").TxInstance;
    }>;
    getAddressType: ({ address, networkName }: {
        address: string;
        networkName: string;
    }) => string;
    getUtxo: ({ networkName, address }: {
        networkName: string;
        address: string;
    }) => Promise<{
        txid: string;
        vout: number;
        value: number;
    }[]>;
    getFeeRate: (networkName: string) => Promise<import("@mempool/mempool.js/lib/interfaces/bitcoin/fees").FeesRecommended>;
    getTransactionDetails: ({ txid, networkName }: {
        txid: string;
        networkName: string;
    }) => Promise<import("@mempool/mempool.js/lib/interfaces/bitcoin/transactions").Tx>;
    createTransaction: ({ input, output, addressType, networkName, feeRate, privateKey, wif }: {
        input: any;
        output: any;
        addressType: string;
        networkName: string;
        feeRate: number;
        privateKey?: string;
        wif?: string;
    }) => Promise<Error | {
        input: any;
        output: any;
        transactionFee: number;
        transactionSize: {
            txVBytes: number;
            txBytes: number;
            txWeight: number;
        };
        totalSpent: number;
    }>;
    signTransaction: (transaction: TransactionDetails) => {
        txHex: string;
        signedTransaction: import("bitcoinjs-lib").Transaction;
    };
    createSingleTransaction: ({ receiver, amount, addressType, networkName, feeRate, privateKey, wif }: {
        receiver: string;
        amount: number;
        addressType: string;
        networkName: string;
        feeRate: number;
        privateKey?: string;
        wif?: string;
    }) => Promise<any>;
    getInputData: (addressType: string, input: any, networkName: string, privateKey?: string, wif?: string) => Promise<any>;
    getTransactionSize: ({ input, output, addressType }: {
        input: number;
        output: any;
        addressType: string;
    }) => {
        txVBytes: number;
        txBytes: number;
        txWeight: number;
    };
    protected getNetwork: (networkName: string) => networks.Network;
    protected getKeyPair: (privateKey: any, networkName: string) => import("ecpair").ECPairInterface;
    protected mainnetAddressType: (address: string, networkName: string) => "P2PKH" | "P2SH" | "P2TR" | "P2WPKH";
    protected testnetAddressType: (address: string) => "P2PKH" | "P2SH" | "P2TR" | "P2WPKH";
    protected checkTaproot: (address: string, networkName: string) => boolean;
    protected checkSegwit: (address: string, networkName: string) => boolean;
    protected tweakSigner(signer: any, opts: any): import("ecpair").ECPairInterface;
    protected tapTweakHash(pubKey: any, h: any): Buffer;
    protected toXOnly(pubkey: any): any;
    protected getSizeOfScriptLengthElement: (length: any) => 1 | 3 | 5 | 2;
    protected getSizeOfVarInt: (length: any) => 1 | 3 | 5 | 9;
    protected getTxOverheadVBytes: (input_script: any, input_count: any, output_count: any) => number;
    protected getTxOverheadExtraRawBytes: (input_script: any, input_count: any) => number;
}
