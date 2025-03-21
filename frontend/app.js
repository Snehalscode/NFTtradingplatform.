const contractAddress = "0xfae118580f719FE90962D7b46500feda87A98a10";
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; 

let web3;
let contract;

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        contract = new web3.eth.Contract(abi, contractAddress);
    } else {
        alert("Please install MetaMask!");
    }
};

async function listNFT() {
    const nftAddress = document.getElementById("nftAddress").value;
    const tokenId = document.getElementById("tokenId").value;
    const price = document.getElementById("price").value;

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.listNFT(nftAddress, tokenId, web3.utils.toWei(price, "ether"))
            .send({ from: accounts[0] });

        alert("NFT listed successfully!");
    } catch (error) {
        console.error(error);
        alert("Transaction failed!");
    }
}
