// const hre = require("hardhat");

async function ensureSufficientBalance(accountAddress, amountInEther) {
  const [funder] = await hre.ethers.getSigners(); // Use the first account as the funder
  
  // Get the balance of the target account
  const balance = await hre.ethers.provider.getBalance(accountAddress);
  const requiredBalance = hre.ethers.utils.parseEther(amountInEther);

  // If the balance is less than the required amount, send Ether to the account
  if (balance.lt(requiredBalance)) {
    const tx = await funder.sendTransaction({
      to: accountAddress,
      value: requiredBalance.sub(balance), // Top up to the required balance
    });
    await tx.wait();
    console.log(`Funded ${accountAddress} with ${amountInEther} GO`);
  } else {
    console.log(`${accountAddress} already has sufficient balance.`);
  }
}

async function main() {
  const callingAccount = "0xYourAccountAddress"; // Replace with the actual address
  
  // Ensure the account has at least 1 Ether
  await ensureSufficientBalance(callingAccount, "1.0");

  // Now proceed with the transaction (e.g., casting a vote)
  // You would have your transaction code here, like:
  // await votingContract.castVote(...);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });