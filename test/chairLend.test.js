const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
describe("ChairLend testing", () => {
    let deployer, ChairLend, user, userChairLend

    beforeEach(async () => {
        await deployments.fixture(["all"])
        deployer = (await getNamedAccounts()).deployer
        ChairLend = await ethers.getContract("ChairLend", deployer)
        const accounts = await ethers.getSigners()
        user = accounts[1]
        userChairLend = await ChairLend.connect(user)
    })

    describe("Set the constructor", () => {
        it("The owner is deployer", async () => {
            const contractOwner = await ChairLend.getOwner()
            assert.equal(contractOwner, deployer)
        })
        it("ChairLend get tokens", async () => {
            const mintedTokens = ethers.utils.parseEther("1000")
            const chairLendTokenBalance =
                await ChairLend.getContractTokenBalance()
            assert.equal(
                mintedTokens.toString(),
                chairLendTokenBalance.toString()
            )
        })
    })

    describe("Deposits", () => {
        it("User get funds deposited", async () => {
            const sendValue = ethers.utils.parseEther("10")
            await userChairLend.deposit({ value: sendValue })
            const userDeposits = await userChairLend.getUserDeposits(
                user.address
            )
            assert.equal(sendValue.toString(), userDeposits.toString())
        })
    })

    describe("Withdraw", () => {
        it("User withdraw his deposits", async () => {
            const sendValue = ethers.utils.parseEther("10")
            await ChairLend.deposit({ value: sendValue })
            const userDepositsBefore = await ChairLend.getUserDeposits(deployer)
            await ChairLend.withdraw()
            const userDepositsAfter = await ChairLend.getUserDeposits(deployer)
            assert.equal(userDepositsBefore.toString(), sendValue.toString())
            assert.equal(userDepositsAfter.toString(), "0")
        })

        it("Reverts when user try to withdraw with 0 deposits", async () => {
            await expect(
                userChairLend.withdraw()
            ).to.be.revertedWithCustomError(
                userChairLend,
                "ChairLend_notFoundsDeposited"
            )
        })
    })

    describe("Borrows", () => {
        it("User borrow update", async () => {
            const sendValue = ethers.utils.parseEther("10")
            const borrowAmount = ethers.utils.parseEther("5")
            await ChairLend.deposit({ value: sendValue })
            await ChairLend.borrow(borrowAmount)
            const userBorrows = await ChairLend.getUserBorrows(deployer)
            assert.equal(userBorrows.toString(), borrowAmount.toString())
        })

        it("User deposits locks in contract", async () => {
            const sendValue = ethers.utils.parseEther("10")
            const borrowAmount = ethers.utils.parseEther("5")
            await ChairLend.deposit({ value: sendValue })
            await ChairLend.borrow(borrowAmount)
            const userDepositsAfterBorrow = await ChairLend.getUserDeposits(
                deployer
            )
            assert.equal(userDepositsAfterBorrow.toString(), "0")
        })

        it("Reverts when user dont have enough deposits", async () => {
            const sendValue = ethers.utils.parseEther("10")
            const borrowAmount = ethers.utils.parseEther("20")
            await userChairLend.deposit({ value: sendValue })
            await expect(
                userChairLend.borrow(borrowAmount)
            ).to.be.revertedWithCustomError(
                ChairLend,
                "ChairLend_notEnoughCollateral"
            )
        })

        it("Reverts when contract run out of tokens", async () => {
            const sendValue = ethers.utils.parseEther("5000")
            const borrowAmount = ethers.utils.parseEther("2500")
            await userChairLend.deposit({ value: sendValue })
            await expect(
                userChairLend.borrow(borrowAmount)
            ).to.be.revertedWithCustomError(
                userChairLend,
                "ChairLend_notAviableTokensLeft"
            )
        })
    })
    describe("Repayments", () => {
        it("User is able to repay his borrow", async () => {
            const sendValue = ethers.utils.parseEther("10")
            const borrowAmount = ethers.utils.parseEther("5")
            await ChairLend.deposit({ value: sendValue })
            await ChairLend.borrow(borrowAmount)
            await ChairLend.rePay(borrowAmount)
            const userDepositsAfterWithdraw = await ChairLend.getUserDeposits(
                deployer
            )
            assert.equal(
                userDepositsAfterWithdraw.toString(),
                sendValue.toString()
            )
        })

        it("Users borrows decrease", async () => {
            const sendValue = ethers.utils.parseEther("10")
            const borrowAmount = ethers.utils.parseEther("5")
            await userChairLend.deposit({ value: sendValue })
            const userInitialBorrows = await userChairLend.getUserBorrows(
                user.address
            )
            await userChairLend.borrow(borrowAmount)
            await userChairLend.rePay(borrowAmount)
            const userFinalBorrows = await userChairLend.getUserBorrows(
                user.address
            )
            assert.equal(
                userInitialBorrows.toString(),
                userFinalBorrows.toString()
            )
        })
    })
})
