// const hre = require("hardhat");

async function main() {
    // Replace with the deployed DecentralizedVotingProtocol address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Get the contract factory and attach to the deployed contract
    const DecentralizedVotingProtocol = await hre.ethers.getContractFactory("DecentralizedVotingProtocol");
    const votingContract = DecentralizedVotingProtocol.attach(contractAddress);

    // Poll details
    const pollName = "batman vs superman";
    const pollDesc = "Vote for your favorite character!";
    const options = ["superman", "batman"];
    const imageURLs = [
        "https://example.com/spongebob.jpg",  // Replace with actual URL
        "https://example.com/patrick.jpg"     // Replace with actual URL
    ];

    // Set start and end times (Unix timestamp)
    const startTime = Math.floor(Date.now() / 1000); // Start in 3 seconds
    const endTime = startTime + 360000; // End 100 hrs after start time

    // Call createPoll function on the contract
    try {
        const tx = await votingContract.createPoll(
            pollName,
            pollDesc,
            startTime,
            endTime,
            options,
            imageURLs
        );
        await tx.wait(); // Wait for transaction to be mined
        console.log("Poll created successfully!");
    } catch (error) {
        console.error("Error creating poll:", error);
    }

    // Advance time by bufferSeconds + 1 to ensure poll is active
    bufferSeconds = 60;
    await hre.network.provider.send("evm_increaseTime", [bufferSeconds + 1]); // Increase time by bufferSeconds + 1
    await hre.network.provider.send("evm_mine"); // Mine a new block with the updated timestamp
    console.log(`Advanced time by ${bufferSeconds + 1} seconds.`);
}

// Run the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });