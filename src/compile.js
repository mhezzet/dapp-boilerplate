const fs = require('fs')
const path = require('path')
const solc = require('solc')

const readFile = (filePath, encoding) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (error, data) => {
      if (error) reject(error)

      resolve(data)
    })
  })

const compile = async contractName => {
  const contractFileName = contractName + '.sol'
  const contractPath = path.resolve(__dirname, 'contracts', contractFileName)

  const contractSource = await readFile(contractPath, 'utf-8')

  const input = {
    language: 'Solidity',
    sources: {
      [contractName]: { content: contractSource },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  }

  const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    contractName
  ].Inbox

  const abi = output.abi
  const bytecode = output.evm.bytecode.object

  return { abi, bytecode }
}

module.exports = compile
