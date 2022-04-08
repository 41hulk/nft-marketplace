// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Marketplace is ReentrancyGuard{

     address payable public immutable feeAccount; // Account to receive fees
     uint public immutable feePercent; // The fee percentage on sale
     uint public itemCount; // The number of items in the marketplace

     constructor(uint _feePercent){
         feeAccount=payable(msg.sender);
         feePercent=_feePercent;
         }

}