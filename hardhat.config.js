require("@nomicfoundation/hardhat-toolbox")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")
require("dotenv").config()
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const POLYSCAN_API_KEY = process.env.POLYSCAN_API_KEY
module.exports = {
    solidity: "0.8.17",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        polygonMumbai: {
            chainId: 80001,
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        polygon: {
            chainId: 137,
            url: POLYGON_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    etherscan: {
        apiKey: {
            polygonMumbai: POLYSCAN_API_KEY,
            polygon: POLYSCAN_API_KEY,
        },
    },
}
