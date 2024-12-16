import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPollDetails, fetchVoteCounts, castVote } from '../blockchain';
import NavBar from '../components/NavBar';

function PollDetails() {
  const { pollId } = useParams(); // Extract pollId from the URL
  const [poll, setPoll] = useState(null);
  const [voteCounts, setVoteCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [refresh, setRefresh] = useState(false); // State to trigger poll refresh

  // Load current account
  useEffect(() => {
    async function loadAccount() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setCurrentAccount(accounts[0]);

        window.ethereum.on("accountsChanged", (accounts) => {
          setCurrentAccount(accounts[0] || "");
        });
      } else {
        console.error("MetaMask not available.");
      }
    }

    loadAccount();
  }, [pollId]);

  useEffect(() => {
    const fetchPollDetailsData = async () => {
      setLoading(true);
      try {
        const pollDetails = await fetchPollDetails(pollId);
        setPoll(pollDetails);
      } catch (error) {
        console.error("Error fetching poll details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchVoteCountsData = async () => {
      try {
        const voteCountsData = await fetchVoteCounts(pollId);
        setVoteCounts(voteCountsData);
      } catch (error) {
        console.error("Error fetching vote counts:", error);
        setVoteCounts([]); // Set to an empty array if fetching fails
      }
    };
  
    if (pollId) {
      fetchPollDetailsData();
      fetchVoteCountsData();
    }
  }, [pollId, refresh]);

  const handleVote = async (pollId, optionIndex) => {
    if (!pollId || optionIndex == null || !currentAccount) {
      console.error("Missing pollId, optionIndex, or currentAccount.");
      return;
    }
    try {
      const success = await castVote(pollId, optionIndex, currentAccount);
      if (success) {
        alert("Vote cast!");
        setRefresh((prev) => !prev); // Trigger refresh of poll details
      } else {
        alert("Failed to cast vote.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="loading">Loading poll...</div>;
  }

  if (!poll) {
    return <div className="not-found">Poll not found.</div>;
  }

  return (
    <div className="PollDetails">
      <NavBar currentAccount={currentAccount} />
      <div className="center-container">
        <div className="poll-details" style={{ marginBottom: "20px" }}>
          <p>{poll.title}</p>
          <p>Total Votes: {poll.totalVotes}</p>
          <div className="poll-details-options" style={{ display: "flex", gap: "20px" }}>
            {poll.options &&
              poll.options.map((option, i) => (
                <div key={i} className="poll-details-option">
                  <p>{option}</p>
                  <p>Votes: {voteCounts.length > 0 ? voteCounts[i] : "Loading..."}</p>
                  <button onClick={() => handleVote(Number(poll.pollId), Number(i))}>
                    Vote
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollDetails;
