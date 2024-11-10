// const hre = require("hardhat");

async function main() {
    // Replace with the deployed DecentralizedVotingProtocol address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Get the contract factory and attach to the deployed contract
    const DecentralizedVotingProtocol = await hre.ethers.getContractFactory("DecentralizedVotingProtocol");
    const votingContract = DecentralizedVotingProtocol.attach(contractAddress);

    // Poll details
    const pollName = "SpongeBob vs Patrick";
    const pollDesc = "Vote for your favorite character!";
    const options = ["SpongeBob", "Patrick"];
    const imageURLs = [
        "https://example.com/spongebob.jpg",  // Replace with actual URL
        "https://example.com/patrick.jpg"     // Replace with actual URL
    ];

    // Set start and end times (Unix timestamp)
    const startTime = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
    const endTime = startTime + 3600; // End 1 hour after start time

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
}

// Run the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });