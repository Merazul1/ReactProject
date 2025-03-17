const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const price=require("crypto-price");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const ethUtil = require("ethereumjs-util");
const ethereum_address = require("ethereum-address");

const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

const contractAddress = "0x79199ead06941f7b996f8867dabcb868ca7a1b92"; // Deployed manually
const abi =[{"inputs":[{"internalType":"contract IERC20","name":"_Token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"ClaimBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"Token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"claimToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_contributors","type":"address[]"},{"internalType":"uint256[]","name":"__balances","type":"uint256[]"}],"name":"multisendToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pauseContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"register","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_token","type":"uint256"}],"name":"sell","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable[]","name":"_contributors","type":"address[]"},{"internalType":"uint256[]","name":"__balances","type":"uint256[]"}],"name":"sendMultiBnb","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"unpauseContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdt","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}];


app.post("/getTransactionStatus", async function (req, res) {
  const hash = req.body.hash;
try {
 let result = await web3.eth.getTransactionReceipt(hash);
 if(result.status){
  res.send({success:true,nonce:"confirmed"})
 }
 else{
  res.send({success:true,nonce:"Failed"})
 }
  
} catch (error) {
  console.log(error);
 res.send({success:false,error:"Pending"}) 
}
  
});
app.post("/getTokenBalance", async function (req, res) {
  const address = req.body.address;
  const contract = new web3.eth.Contract(abi, contractAddress, {
    from: address,
    gasLimit: 3000000,
  });
try {
  const balance=await contract.methods.balanceOf(address).call();
  res.send({success:true,balance:balance/1000000})
} catch (error) {
 res.send({success:false,error:"Transaction error!"}) 
}
  
});
app.post("/converter", async function (req, res) {
  let amount = req.body.amount;
  try {
    price.getBasePrice('BNB', 'USD').then(obj => { // Base for ex - USD, Crypto for ex - 
      var usd= amount * obj.price;
      console.log(usd)
      res.send({success:true,msg:usd});
  }).catch(err => {
      console.log(err)
      res.send({success:false, msg:"Conversion Issue from BTC"})
  })
  } catch (error) {
    console.log(error);
    res.send({ success: false, result:" Error" });
  }
});

app.listen(5111, function () {
  console.log("Server started at 5111...");
});