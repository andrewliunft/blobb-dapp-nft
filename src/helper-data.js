const networkConfig = {
  networks: [137, 80001, 31337,], //1, 137
  31337: {
    name: "LOCALHOST"
  },
  1: {
    name: "MAINNET"
  },
  5: {
    name: "GOERLI"
  },
  10: {
    name: "OPTIMISM"
  },
  56: {
    name: "BINANCE"
  },
  137: {
    name: "POLYGON"
  },
  80001: {
    name: "MUMBAI"
  },  
}

module.exports = {
  networkConfig,
}