const ganache = require('ganache')
const Web3 = require('web3')
const compile = require('../compile')

const web3 = new Web3(ganache.provider())

let accounts
let inboxContract

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  const { abi, bytecode } = await compile('inbox')

  inboxContract = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: ['Hi there!'],
    })
    .send({ from: accounts[0], gas: 1000000 })
})

describe('Inbox', () => {
  it('should deploys a contract', () => {
    expect(inboxContract.options.address).toBeDefined()
  })

  it('can have a default message', async () => {
    const message = await inboxContract.methods.message().call()

    expect(message).toBe('Hi there!')
  })

  it('can change the message ', async () => {
    await inboxContract.methods
      .setMessage('new message')
      .send({ from: accounts[0], gas: 1000000 })

    const message = await inboxContract.methods.message().call()
    expect(message).toBe('new message')
  })
})
