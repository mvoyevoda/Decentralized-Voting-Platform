import { useEffect, useState } from "react";
import { fetchPollPreviews, castVote } from "./blockchain";
import { Link } from 'react-router-dom';
import ViewPolls from "./components/PollPreviews";

function HomePage() {

  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    async function loadAccount() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setCurrentAccount(accounts[0]);

        // Listen for account changes in MetaMask
        window.ethereum.on("accountsChanged", (accounts) => {
          setCurrentAccount(accounts[0] || ""); // Update displayed account
        });
      } else {
        console.error("MetaMask is not available.");
      }
    }

    loadAccount();

    // Load polls initially
    async function loadPolls() {
      const pollData = await fetchPollPreviews();
      setPolls(pollData);
      setIsLoading(false);
    }

    loadPolls();
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } else {
      alert("MetaMask is not installed.");
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    console.log("Attempting to cast vote with parameters:");
    console.log("Poll ID:", pollId);
    console.log("Option Index:", optionIndex);
    console.log("Current Account:", currentAccount);
  
    // Check if parameters are defined and valid
    if (pollId == null || optionIndex == null || currentAccount == null) {
      console.error("Error: Missing pollId, optionIndex, or currentAccount.");
      return;
    }
  
    try {
      const success = await castVote(pollId, optionIndex, currentAccount);
      if (success) {
        alert("Vote cast successfully!");
        window.location.reload();
        // Optional: Reload poll data to reflect new vote count
      } else {
        alert("Failed to cast vote.");
      }
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  return (
    <div className="App">
      <div style={{ padding: "10px", backgroundColor: "#f0f0f0", marginBottom: "20px" }}>
        <strong>Current Account:</strong> {currentAccount || "Not connected"}
        {!currentAccount && (
          <button onClick={handleConnectWallet} style={{ marginLeft: "10px" }}>
            Connect Wallet
          </button>
        )}
      </div>
      <h1>Decentralized Voting Platform</h1>
      {/* <VerifyVoter /> */}
      <ViewPolls 
        polls={polls} 
        isLoading={isLoading} 
        currentAccount={currentAccount} 
        handleVote={handleVote} 
      />

      <button><Link to="/pollform">Create a Poll  </Link></button>
      
    </div>
  );
}

export default HomePage;