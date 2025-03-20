// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface INFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract NFTMarketplace {
    struct Listing {
        address seller;
        uint256 price;
        bool isListed;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event NFTListed(address indexed nft, uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTPurchased(address indexed nft, uint256 indexed tokenId, address indexed buyer, uint256 price);
    event NFTDelisted(address indexed nft, uint256 indexed tokenId, address indexed seller);

    modifier onlyOwner(address nft, uint256 tokenId) {
        require(INFT(nft).ownerOf(tokenId) == msg.sender, "Not the NFT owner");
        _;
    }

    modifier isListed(address nft, uint256 tokenId) {
        require(listings[nft][tokenId].isListed, "NFT not listed");
        _;
    }

    function listNFT(address nft, uint256 tokenId, uint256 price) external onlyOwner(nft, tokenId) {
        require(price > 0, "Price must be greater than zero");
        INFT(nft).transferFrom(msg.sender, address(this), tokenId);

        listings[nft][tokenId] = Listing(msg.sender, price, true);
        emit NFTListed(nft, tokenId, msg.sender, price);
    }

    function buyNFT(address nft, uint256 tokenId) external payable isListed(nft, tokenId) {
        Listing memory listing = listings[nft][tokenId];
        require(msg.value >= listing.price, "Insufficient payment");

        listings[nft][tokenId].isListed = false;
        payable(listing.seller).transfer(listing.price);
        INFT(nft).transferFrom(address(this), msg.sender, tokenId);

        emit NFTPurchased(nft, tokenId, msg.sender, listing.price);
    }

    function delistNFT(address nft, uint256 tokenId) external isListed(nft, tokenId) {
        require(listings[nft][tokenId].seller == msg.sender, "Not the seller");

        listings[nft][tokenId].isListed = false;
        INFT(nft).transferFrom(address(this), msg.sender, tokenId);

        emit NFTDelisted(nft, tokenId, msg.sender);
    }
}
