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
    const containerStyle = {
      maxWidth: '800px',
      margin: '0 auto',
      marginTop: '60px',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    };
  
    const cardStyle = {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
    };
  
    const titleStyle = {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
    };
  
    const totalVotesStyle = {
      fontSize: '14px',
      color: '#666',
      marginBottom: '20px',
    };
  
    const optionsContainerStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    };
  
    const optionCardStyle = {
      backgroundColor: '#f8f8f8',
      borderRadius: '4px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    };
  
    const optionTitleStyle = {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
    };
  
    const voteCountStyle = {
      fontSize: '14px',
      color: '#666',
      marginBottom: '15px',
    };
  
    const buttonStyle = {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      padding: '10px 15px',
      fontSize: '14px',
      cursor: 'pointer',
      width: '100%',
    };
  
    return (
      <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <NavBar currentAccount={currentAccount} />
        <div style={containerStyle}>
          <div style={cardStyle}>
            <h2 style={titleStyle}>{poll.title}</h2>
            <p style={totalVotesStyle}>Total Votes: {poll.totalVotes}</p>
            <div style={optionsContainerStyle}>
              {poll.options &&
                poll.options.map((option, i) => (
                  <div key={i} style={optionCardStyle}>
                    <h3 style={optionTitleStyle}>{option}</h3>
                    <p style={voteCountStyle}>
                      Votes: {voteCounts.length > 0 ? voteCounts[i] : "Loading..."}
                    </p>
                    <button
                      onClick={() => handleVote(Number(poll.pollId), Number(i))}
                      style={buttonStyle}
                    >
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
