//const hre = require("hardhat");

export async function addPoll(event, pollName1, pollDesc1, options1, imageURLS1, startTime1, endTime1) {
  event.preventDefault();
  
    // Replace with the deployed DecentralizedVotingProtocol address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get the contract factory and attach to the deployed contract
  const DecentralizedVotingProtocol = await hre.ethers.getContractFactory("DecentralizedVotingProtocol");
  const votingContract = DecentralizedVotingProtocol.attach(contractAddress);

  // Poll 1 details: "batman vs superman"
//   const pollName1 = "batman vs superman";
//   const pollDesc1 = "Vote for your favorite character!";
//   const options1 = ["superman", "batman"];
//   const imageURLs1 = [
//       "https://example.com/spongebob.jpg",  // Replace with actual URL
//       "https://example.com/patrick.jpg"     // Replace with actual URL
//   ];
//   const startTime1 = Math.floor(Date.now() / 1000); // Start immediately
//   const endTime1 = startTime1 + 360000; // End 100 hrs after start time

  // Call createPoll function on the contract for Poll 1
  try {
      const tx1 = await votingContract.createPoll(
          pollName1,
          pollDesc1,
          startTime1,
          endTime1,
          options1,
          imageURLs1
      );
      await tx1.wait(); // Wait for transaction to be mined
      console.log("Poll 1 created successfully!");
  } catch (error) {
      console.error("Error creating Poll 1:", error);
  }

  // Poll 2 details: "salmon vs tuna"
  const pollName2 = "salmon vs tuna";
  const pollDesc2 = "Vote for your favorite fish!";
  const options2 = ["salmon", "tuna"];
  const imageURLs2 = [
      "https://example.com/salmon.jpg",  // Replace with actual URL
      "https://example.com/tuna.jpg"     // Replace with actual URL
  ];
  const startTime2 = Math.floor(Date.now() / 1000) + 3; // Start 3 seconds later
  const endTime2 = startTime2 + 360000; // End 100 hrs after start time

  // Call createPoll function on the contract for Poll 2
  try {
      const tx2 = await votingContract.createPoll(
          pollName2,
          pollDesc2,
          startTime2,
          endTime2,
          options2,
          imageURLs2
      );
      await tx2.wait(); // Wait for transaction to be mined
      console.log("Poll 2 created successfully!");
  } catch (error) {
      console.error("Error creating Poll 2:", error);
  }

  // Advance time by bufferSeconds + 1 to ensure polls are active
  const bufferSeconds = 60;
  await hre.network.provider.send("evm_increaseTime", [bufferSeconds + 1]); // Increase time by bufferSeconds + 1
  await hre.network.provider.send("evm_mine"); // Mine a new block with the updated timestamp
  console.log(`Advanced time by ${bufferSeconds + 1} seconds.`);
}

// Run the main function
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//       console.error(error);
//       process.exit(1);
//   });