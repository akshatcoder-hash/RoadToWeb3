// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

// Returns the Ether balance of a given address.
async function getBalance(address)  {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses)  {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}
// Logs the memo stored on chain from coffee purchases.
async function printMemos(memos) {
 for (const memo of memos)  {
  const timestamp = memo.timestamp;
  const tipper = memo.name;
  const tipperAddress = memo.name;
  const message = memo.message;
  console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
 } 
}


async function main() {

  // Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  // Get and deploy the contract.
  const BuyMeACoffee = await hre.ethers.
  getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

  // Check balances before the coffee purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = {value: hre.ethers.utils.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Carolina", "Good Job!", tip);
  await buyMeACoffee.connect(tipper).buyCoffee("Vitto", "Amazing Work", tip);
  await buyMeACoffee.connect(tipper).buyCoffee("Kay", "Have some Coffee", tip);

  // Check balances after coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw funds.
  await buyMeACoffee.connect(owner).withdrawTips;

  // Check balance after withdraw.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Read all the memos left for the owner.
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
