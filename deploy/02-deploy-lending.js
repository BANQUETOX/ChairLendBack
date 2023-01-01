const { ethers, run } = require("hardhat")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    await deploy("ChairLend", {
        from: deployer,
        arg: [],
        log: true,
    })
}

module.exports.tags = ["ChairLend", "all"]
