//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../contracts/ChairCoin.sol";
//errors
error ChairLend_notFoundsDeposited();
error ChairLend_notEnoughCollateral();
error ChairLend_notAviableTokensLeft();

contract ChairLend is ChairCoin {
    //global variables
    uint256 contractBalance;
    address private immutable i_owner;
    mapping(address => uint256) s_userToDeposits;
    mapping(address => uint256) s_userCollateral;
    mapping(address => uint256) s_userToBorrows;

    //structs
    constructor() {
        i_owner = msg.sender;
        mint(address(this), 1000e18);
    }

    //functions

    function deposit() public payable {
        s_userToDeposits[msg.sender] += msg.value;
        contractBalance += msg.value;
    }

    function withdraw() public {
        if (s_userToDeposits[msg.sender] == 0) {
            revert ChairLend_notFoundsDeposited();
        }
        payable(msg.sender).transfer(s_userToDeposits[msg.sender]);
        s_userToDeposits[msg.sender] = 0;
    }

    function borrow(uint256 _amount) public {
        if (balanceOf(address(this)) < _amount) {
            revert ChairLend_notAviableTokensLeft();
        }
        if (_amount >= s_userToDeposits[msg.sender] * 2) {
            revert ChairLend_notEnoughCollateral();
        }
        _transfer(address(this), msg.sender, _amount);
        s_userToDeposits[msg.sender] -= _amount * 2;
        s_userToBorrows[msg.sender] += _amount;
    }

    function rePay(uint256 _amount) public payable {
        _transfer(msg.sender, address(this), _amount);
        s_userToDeposits[msg.sender] += _amount * 2;
        s_userToBorrows[msg.sender] -= _amount;
    }

    //view functions
    function getContractBalance() public view returns (uint256) {
        return contractBalance;
    }

    function getContractTokenBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }

    function getUserDeposits(address _user) public view returns (uint256) {
        return s_userToDeposits[_user];
    }

    function getUserBorrows(address _user) public view returns (uint256) {
        return s_userToBorrows[_user];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }
}
