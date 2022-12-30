const { ethers, run } = require("hardhat")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    await deploy("ChairLend", {
        from: deployer,
        arg: [],
        log: true,
    })
    // const ChairLend = ethers.getContract("ChairLend")
    // const contractAddress = (await ChairLend).address
    // if (chainId !== 31337) {
    //     await run("verify:verify", {
    //         address: contractAddress,
    //     })
    // }
}

module.exports.tags = ["ChairLend", "all"]
