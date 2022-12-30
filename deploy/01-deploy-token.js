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
    // const chainId = networks.name.chainId
    // const ChairCoin = ethers.getContract("ChairCoin")
    // const contractAddress = (await ChairCoin).address
    // if (chainId !== 31337) {
    //     await run("verify:verify", {
    //         address: contractAddress,
    //     })
    // }
}

module.exports.tags = ["ChairCoin", "all"]
