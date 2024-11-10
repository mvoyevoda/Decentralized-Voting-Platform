import Web3 from "web3";
import DecentralizedVotingProtocolABI from "./DecentralizedVotingProtocolABI.json";

const loadWeb3AndContract = async () => {
  const web3 = new Web3(import.meta.env.VITE_NETWORK_URL);
  const votingContract = new web3.eth.Contract(
    DecentralizedVotingProtocolABI,
    import.meta.env.VITE_CONTRACT_ADDRESS
  );
  return { web3, votingContract };
};

export const fetchPollPreviews = async () => {
  const { votingContract } = await loadWeb3AndContract();
  try {
    const response = await votingContract.methods.getPollPreviews().call();
    console.log("Full Response from getPollPreviews:", response); // Log the entire response

    // Access each part of the response using its index
    const pollTitles = response[0];
    const isActive = response[1];
    const totalVotes = response[2];

    console.log("Fetched Poll Titles:", pollTitles);
    console.log("Is Active Array:", isActive);
    console.log("Total Votes Array:", totalVotes);

    return pollTitles.map((title, index) => ({
      title,
      isActive: isActive[index],
      totalVotes: totalVotes[index] > 0 ? totalVotes[index] : 0,
    }));
  } catch (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
};

export const createPoll = async (title, desc, options, imageURLs) => {
  const { web3, votingContract } = await loadWeb3AndContract();
  const accounts = await web3.eth.getAccounts();
  try {
    await votingContract.methods
      .createPoll(
        title,
        desc,
        Math.floor(Date.now() / 1000) + 60,
        Math.floor(Date.now() / 1000) + 600,
        options,
        imageURLs
      )
      .send({ from: accounts[0] });
    return true;
  } catch (error) {
    console.error("Error creating poll:", error);
    return false;
  }
};