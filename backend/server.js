const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let nftListings = [];

// Get all NFT listings
app.get("/api/listings", (req, res) => {
    res.json(nftListings);
});

// Add a new NFT listing
app.post("/api/listNFT", (req, res) => {
    const { nftAddress, tokenId, price, seller } = req.body;
    if (!nftAddress || !tokenId || !price || !seller) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const listing = { nftAddress, tokenId, price, seller, isListed: true };
    nftListings.push(listing);
    res.json({ message: "NFT listed successfully", listing });
});

// Buy an NFT (remove from listing)
app.post("/api/buyNFT", (req, res) => {
    const { nftAddress, tokenId, buyer } = req.body;
    nftListings = nftListings.filter(nft => !(nft.nftAddress === nftAddress && nft.tokenId === tokenId));
    res.json({ message: "NFT purchased successfully", buyer });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
