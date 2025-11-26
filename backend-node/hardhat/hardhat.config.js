require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      mining: {
        auto: false,
        interval: 5000  // Mine a block every 5 seconds, allowing multiple transactions per block
      }
    },
    hardhat: {
      mining: {
        auto: false,
        interval: 5000  // Mine a block every 5 seconds
      }
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache"
  }
};
