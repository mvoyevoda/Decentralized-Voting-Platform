import Web3 from "web3";
import DecentralizedVotingProtocolABI from "./DecentralizedVotingProtocolABI.json";

let web3;
let votingContract;

export const loadWeb3AndContract = async () => {
  if (!web3 && window.ethereum) {
    web3 = new Web3(window.ethereum); // Use MetaMask’s provider explicitly
    try {
      // Request account access if not already granted
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; // Retrieve the contract address
      
      // Log contract address and ABI to ensure they are loaded
      console.log("Attempting to load contract with address:", contractAddress);
      console.log("Contract ABI:", DecentralizedVotingProtocolABI);

      // Initialize the contract
      votingContract = new web3.eth.Contract(
        DecentralizedVotingProtocolABI,
        contractAddress
      );
      
      if (!votingContract) {
        throw new Error("Contract failed to initialize. Check the ABI and address.");
      }

      console.log("Contract initialized successfully.");
    } catch (error) {
      console.error("User denied account access or other error:", error);
    }
  } else if (!window.ethereum) {
    console.error("MetaMask is not installed!");
  }
  
  // Ensure votingContract is defined before returning
  if (!votingContract) {
    throw new Error("Failed to initialize contract. Check if MetaMask is connected and contract address is correct.");
  }
  
  return { web3, votingContract };
};

export const fetchPollPreviews = async () => {
  try {
    const { votingContract } = await loadWeb3AndContract();
    
    // Check if votingContract is valid before making the call
    if (!votingContract) {
      throw new Error("votingContract is not initialized.");
    }

    const response = await votingContract.methods.getPollPreviews().call();
    const pollTitles = response[0];
    const isActive = response[1];
    const totalVotes = response[2];

    return pollTitles.map((title, index) => ({
      title,
      isActive: isActive[index],
      totalVotes: totalVotes[index] > 0 ? totalVotes[index] : 0,
      pollId: index + 1, // Assuming pollId is sequential based on index + 1
    }));
  } catch (error) {
    console.error("Error fetching polls in fetchPollPreviews:", error);
    return []; // Return an empty array in case of error to prevent further issues
  }
};

export const fetchPollDetails = async (pollId) => {
  await loadWeb3AndContract();
  try {
    const response = await votingContract.methods.getPoll(pollId).call();

    let totalVotes = 0;
    for (let i = 0; i < response[7].length; i++) {
      const optionVoteCount = await votingContract.methods.getOptionVoteCount(pollId, i).call();
      totalVotes += parseInt(optionVoteCount, 10);
    }

    return {
      pollId: response[0],
      title: response[1],
      description: response[2],
      creator: response[3],
      startTime: response[4],
      endTime: response[5],
      isActive: response[6],
      options: response[7],
      imageURLs: response[8],
      totalVotes: totalVotes,
    };
  } catch (error) {
    console.error(`Error fetching details for poll ID ${pollId}:`, error);
    return null;
  }
};

export const castVote = async (pollId, optionIndex, account) => {
  await loadWeb3AndContract();

  console.log("Attempting to cast vote with parameters:");
  console.log("Poll ID:", pollId);
  console.log("Option Index:", optionIndex);
  console.log("Account:", account);

  // Check for undefined parameters explicitly
  if (pollId == null || optionIndex == null || !account) {
    console.error("Error: Missing parameters in castVote.");
    return false;
  }

  try {
    const transaction = await votingContract.methods
      .castVote(pollId, optionIndex)
      .send({ from: account, gas: 500000 });

    console.log("Vote cast successfully:", transaction);
    return true;
  } catch (error) {
    console.error("Error casting vote:", error.message || error);
    return false;
  }
};