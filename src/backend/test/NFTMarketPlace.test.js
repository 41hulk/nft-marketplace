/* eslint-disable jest/valid-expect */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require("chai");

describe("NFTMarketPlace", () => {
  let deployer, add1, add2, nft, marketplace;
  let feePercent = 1;
  let URI = "Sampe URI";
  beforeEach(async () => {
    const NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");

    [deployer, add1, add2] = await ethers.getSigners();

    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe("deployment", () => {
    it("should track name and symbol of the NFT collection", async () => {
      expect(await nft.name()).to.equal("DApp NFT");
      expect(await nft.symbol()).to.equal("DAPP");
    });
  });
  describe("Minting NFTs", () => {
    it("Should track each minted NFTs", async () => {
      await nft.connect(add1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(add1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);

      await nft.connect(add2).mint(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(add2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("Making marketplace items", () => {
    beforeEach(async function () {
      // addr1 mints an nft
      await nft.connect(add1).mint(URI);
      // addr1 approves marketplace to spend nft
      await nft.connect(add1).setApprovalForAll(marketplace.address, true);
    });
    it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
      // addr1 offers their nft at a price of 1 ether
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price))
      )
        .to.emit(marketplace, "Offered")
        .withArgs(1, nft.address, 1, toWei(price), addr1.address);
      // Owner of NFT should now be the marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      // Item count should now equal 1
      expect(await marketplace.itemCount()).to.equal(1);
      // Get item from items mapping then check fields to ensure they are correct
      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(toWei(price));
      expect(item.sold).to.equal(false);
    });
    it("Should fail if price is set to zero", async function () {
        await expect(
          marketplace.connect(addr1).makeItem(nft.address, 1, 0)
        ).to.be.revertedWith("Price must be greater than zero");
      });
  
  });
});
