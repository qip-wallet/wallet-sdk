type Key = {
    privateKey?:string,
    wif?:string
}

type AddressConfig = {
    addressType:string,
    networkName:string,
    privateKey?:string,
    wif?:string
}

type AccountConfig = {
    passPhrase:string, 
    networkName:string, 
    path:number
}

type TransactionDetails = {
    input:{
      hash:string, 
      index:number, 
      withnessUtxo?:{value:number, script:Buffer}, 
      nonWithnessUtxo?:Buffer
    }[],
    output:any,
    addressType:string,
    networkName:string,
    privateKey?:string,
    wif?:string
  }

export {Key, AddressConfig, AccountConfig, TransactionDetails} 