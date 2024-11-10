import Web3 from "web3";
import DecentralizedVotingProtocolABI from "./DecentralizedVotingProtocolABI.json";

export const loadWeb3AndContract = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum); // Use MetaMask’s provider explicitly
    try {
      // Request account access if not already granted
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const votingContract = new web3.eth.Contract(
        DecentralizedVotingProtocolABI,
        import.meta.env.VITE_CONTRACT_ADDRESS
      );
      return { web3, votingContract };
    } catch (error) {
      console.error("User denied account access:", error);
    }
  } else {
    console.error("MetaMask is not installed!");
  }
};


export const fetchPollPreviews = async () => {
  const { votingContract } = await loadWeb3AndContract();
  try {
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
    console.error("Error fetching polls:", error);
    return [];
  }
};


export const fetchPollDetails = async (pollId) => {
  const { votingContract } = await loadWeb3AndContract();
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


export const castVote = async (pollId, optionIndex) => {
  const { web3, votingContract } = await loadWeb3AndContract();
  const accounts = await web3.eth.getAccounts();
  
  try {
    console.log(`Casting vote for Poll ID: ${pollId}, Option Index: ${optionIndex}, From: ${accounts[0]}`);
    const transaction = await votingContract.methods
      .castVote(pollId, optionIndex)
      .send({ from: accounts[0], gas: 500000 });

    console.log("Vote cast successfully:", transaction);
    return true; // Return true if the vote was successful
  } catch (error) {
    console.error("Error casting vote:", error.message || error);
    alert(`Failed to cast vote: ${error.message || error}`);
    return false; // Return false if the vote failed
  }
};


// export const createPoll = async (title, desc, options, imageURLs) => {
//   const { web3, votingContract } = await loadWeb3AndContract();
//   const accounts = await web3.eth.getAccounts();
//   try {
//     await votingContract.methods
//       .createPoll(
//         title,
//         desc,
//         Math.floor(Date.now() / 1000) + 60,
//         Math.floor(Date.now() / 1000) + 600,
//         options,
//         imageURLs
//       )
//       .send({ from: accounts[0] });
//     return true;
//   } catch (error) {
//     console.error("Error creating poll:", error);
//     return false;
//   }
// };