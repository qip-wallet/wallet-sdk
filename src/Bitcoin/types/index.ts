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

export {Key, AddressConfig, AccountConfig} 