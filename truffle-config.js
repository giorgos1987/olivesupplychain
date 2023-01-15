const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
module.exports = {
  networks: {
    /*inf_olivechain_goerli: {
      network_id: 5,
      gasPrice: 100000000000,
      provider: new HDWalletProvider("art radar purchase slow shine cement photo settle talent snake black treat", "https://goerli.infura.io/v3/c030f76ce283466f876a7938ad20fbbc")
    },
    inf_olivegrove_goerli: {
      network_id: 5,
      gasPrice: 10000000000,
      provider: new HDWalletProvider(fs.readFileSync('c:\\Users\\vlaho\\Desktop\\blockchaain\\contracts\\mnemonic1.env', 'utf-8'), "https://goerli.infura.io/v3/88b274c4abd64975b561012b920d437e")
    },
    inf_olivegroves_goerli: {
      network_id: 5,
      gasPrice: 100000000,
      provider: new HDWalletProvider(fs.readFileSync('c:\\Users\\vlaho\\Desktop\\blockchaain\\contracts\\mnemonic1.env', 'utf-8'), "https://goerli.infura.io/v3/db27ee441cac423a9206684e6149e9f4")
    },*/
    loc_development_development: {
      network_id: "1673811235429",
      port: 8545,
      host: "127.0.0.1"
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: '0.4.24'
    }
  }
};
