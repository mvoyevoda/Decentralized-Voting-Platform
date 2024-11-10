const hre = require("hardhat");

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with the deployed Counter address
    const Counter = await hre.ethers.getContractFactory("Counter");
    const counter = Counter.attach(contractAddress);

    // Check the initial count
    let count = await counter.count();
    console.log("Initial count:", count.toString());

    // Increment the counter
    const tx = await counter.increment();
    await tx.wait(); // Wait for the transaction to be mined

    // Check the count after incrementing
    count = await counter.count();
    console.log("Count after increment:", count.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
