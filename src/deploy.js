require('dotenv-safe').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compile = require('./compile')

const mnemonic = process.env.MNEMONIC
const ethereumClient = process.env.ETHEREUM_CLIENT

console.log('connecting to ethereum...')

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonic,
  },
  providerOrUrl: ethereumClient,
})

const web3 = new Web3(provider)

const deploy = async contractName => {
  const accounts = await web3.eth.getAccounts()
  const { abi, bytecode } = await compile(contractName)

  const usedAccount = accounts[0]

  console.log('deploying from account', usedAccount, '...')

  const contract = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: ['Hi there!'],
    })
    .send({ from: usedAccount, gas: 1000000 })

  console.log('contract address', contract.options.address)
}

if (!process.argv[2]) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'enter the contract name \nexample: npm run deploy inbox'
  )
  process.exit()
}

deploy(process.argv[2])
