const { expect, assert } = require("chai")
const { getNamedAccounts, ethers } = require("hardhat")

describe("ChairCoin test", () => {
    let deployer, receiver, ChairCoin

    beforeEach(async () => {
        await deployments.fixture(["all"])
        deployer = (await getNamedAccounts()).deployer
        receiver = (await getNamedAccounts()).receiver
        ChairCoin = await ethers.getContract("ChairCoin", deployer)
    })

    it("The owner get initial coins", async () => {
        const totalCoinSupply = await ChairCoin.totalSupply()
        const ownerBalance = await ChairCoin.balanceOf(deployer)
        assert.equal(totalCoinSupply.toString(), ownerBalance.toString())
    })

    it("Mint function works", async () => {
        const receiver = ethers.getSigner(3)
        const sendValue = ethers.utils.parseEther("10")
        await ChairCoin.mint((await receiver).address, sendValue)
        const balanceOfReceiver = await ChairCoin.balanceOf(
            (
                await receiver
            ).address
        )
        assert.equal(balanceOfReceiver.toString(), sendValue.toString())
    })
})
