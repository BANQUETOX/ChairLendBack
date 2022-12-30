const FRONT_END_ADDRESSES_FILE =
    "../chairlendapp/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../chairlendapp/constants/abi.json"
const fs = require("fs")
const { network } = require("hardhat")

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("ChairLend")
    fs.writeFileSync(
        FRONT_END_ABI_FILE,
        raffle.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const chairlend = await ethers.getContract("ChairLend")
    const contractAddresses = JSON.parse(
        fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
    )
    if (network.config.chainId.toString() in contractAddresses) {
        if (
            !contractAddresses[network.config.chainId.toString()].includes(
                chairlend.address
            )
        ) {
            contractAddresses[network.config.chainId.toString()].push(
                chairlend.address
            )
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = [
            chairlend.address,
        ]
    }
    fs.writeFileSync(
        FRONT_END_ADDRESSES_FILE,
        JSON.stringify(contractAddresses)
    )
}
module.exports.tags = ["all", "frontend"]
