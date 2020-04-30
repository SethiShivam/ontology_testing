const { Identity, Crypto, OntidContract,Wallet,Account,Address,
     TransactionBuilder, RestClient, CONST ,Claim,DDO ,makeTransferTx} = require('ontology-ts-sdk');
//generate a random private key
const walletFile = require('./walletFile')
// Create ontology Identity 

async function createAccount(){
    let mnc = "position manual door toast prevent view season chicken jelly carry duck moral lunch glass wonder foster loud lesson monitor assist addict brass peanut clip"
   
    var account = Account.importWithMnemonic( "b45c5e8f-794e-40d5-b6d8-215b38ad1457", mnc, "test" );
   
 
    return account

}
async function createWallet(){

    var wallet = Wallet.create('test')
    console.log("Wallet created : ",wallet)
    let account =  await createAccount().then(res=>{
        return res
    })
     wallet.addAccount(account)
     console.log("Account Added ========>",wallet)
return wallet
}

async function createIdentity() {
    console.log("Inside createIdentity ")
    const privateKey = Crypto.PrivateKey.random()
    // await Crypto.PrivateKey.random();
    var password = "test"
    var label = 'test'
    var identity = await Identity.create(privateKey, password, label)
    console.log("Your ontology ID is ------------->", identity.ontid)
}



async function createAndSignTx() {
    console.log("Inside createAndSignTx ")
 
    const privateKey = await Crypto.PrivateKey.random();
    //console.log("Private key ------------------_>",)
    var password = "test"
    var label = 'test'
    var identity = await Identity.create(privateKey, password, label)
    //console.log("Your ontology ID is ------------->", identity.ontid)
    const did = identity.ontid

    const pk = privateKey.getPublicKey();
   // console.log("publicKey is ====> \n", pk)
    const gasPrice = '0';
    const gasLimit = '20000';
    const tx = OntidContract.buildRegisterOntidTx(did, pk, gasPrice, gasLimit);
    console.log('tx --------------------->', tx)
    const response = await TransactionBuilder.signTransaction(tx, privateKey);
    console.log("response =:", response)
}

async function pushTxOnChain() {
 let walletData = await createWallet()
    console.log("Inside pushTxOnChain ")
    const mnemonics = 'subway just curve face embrace bargain cactus salute fluid bike analyst ignore churn age discover typical acid side convince release cause purse dream stairs';
   
    const privateKey =   Crypto.PrivateKey.generateFromMnemonic(mnemonics, "m/44'/888'/0'/0/0");
    //   console.log("ONT ID Private key ==========>",privateKey)
    //Crypto.PrivateKey.generateFromMnemonic(mnemonics, "m/44'/888'/0'/0/0");
    var password = "test"
    var label = 'test'
    var identity = await Identity.create(privateKey, password, label)
   // console.log("Your ontology ID is ------------->", typeof(identity.ontid),'/n',identity.ontid)
    const did = identity.ontid
    //identity.ontid

    const pk = await  privateKey.getPublicKey();
    const gasPrice = '501';
    const gasLimit = '20001';

    const tx = OntidContract.buildRegisterOntidTx(did, pk, gasPrice, gasLimit);
   
    let wd = walletData
 //   console.log("Wd ------------------------->",wd.accounts[0].address)
    tx.payer = wd.accounts[0].address
    TransactionBuilder.signTransaction(tx, privateKey);
     TransactionBuilder.addSign(tx,wd.accounts[0].exportPrivateKey('test'))

  const rest = new RestClient(CONST.TEST_ONT_URL.REST_URL);
    rest.sendRawTransaction(tx.serialize()).then(res => {
        console.log("TX send Response ", res)
    })
}

async function getDDO(ontid){
    const tx = await  OntidContract.buildGetDDOTx(ontid)
    console.log("DID Document is -------->",tx)

    const rest = new RestClient();
  let response = await  rest.sendRawTransaction(tx.serialize(), true).then(res => {
        console.log("sendRawTransaction response is ",res);
        return res
    })

    const ddo = await DDO.deserialize(response);
console.log("OntoLogy didDocument is ======> \n",ddo)
}


async function generateClaim(){
 
  //  let mnc = "position manual door toast prevent view season chicken jelly carry duck moral lunch glass wonder foster loud lesson monitor assist addict brass peanut clip"
    let wallet  = Wallet.fromWalletFile(walletFile)

    console.log("Imported wallet details are --------->",wallet)

    const socketUrl = 'http://polaris1.ont.io:20335';
    const payerAddress = wallet.accounts[0].address
    console.log("Wallet Address is ------->",payerAddress)
  console.log("Private key is ---------->",wallet.accounts[0].encryptedKey)

  const signature = null;
  const useProof = false;
    const claim = new Claim({
        messageId: '1',
        issuer: wallet.identities[0].ontid,
        subject: 'did:ont:AUEKhXNsoAT27HJwwqFGbpRy8QLHUMBMPz',
        issueAt: 1525800823
    }, signature, useProof);
    claim.version = '0.7.0';
    claim.context = 'https://example.com/template/v1';
    claim.content = {
        Name: 'Shivam',
        Age: '84',
        others : 'TRUE'
    };

//    const privateKey = '7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97'
// await  claim.sign(restUrl, ontoPubKey, signerPrivateKey).catch(e=>{
//     console.log("ERROR is ------------>",e)
// })
console.log("Transaction signed successfully")


const res = await claim.attest(socketUrl, '500', '20000', payerAddress, wallet.accounts[0].exportPrivateKey('test')).catch(e=>{
    console.log("e------------->",e)
    ///account.exportPrivateKey('test')
})

}

getDDO("did:ont:AT41XZFCdCetVsiBa4kwGZwcvY6tY7d4wt")

//pushTxOnChain()


//getDDO("did:ont:AK4W8Vteaexw6b6K8ab4vuCMvTyE9euTEA")


//generateClaim()
//createAndSignTx()
//createIdentity()
//createWallet()