const { networks } = require("../hardhat.config")
const { ethers, run } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    await deploy("ChairCoin", {
        from: deployer,
        arg: [],
        log: true,
    })
}

module.exports.tags = ["ChairCoin", "all"]
