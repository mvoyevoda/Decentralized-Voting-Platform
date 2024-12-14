import { useEffect, useState } from "react";
import { fetchPollPreviews } from "../blockchain";
import PollPreviewList from "../components/PollPreviewList";
import NavBar from "../components/NavBar";
import '../styles/Explore.css'
// import { use } from "chai";

function Explore() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAccount, setCurrentAccount] = useState(null);

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
  }, []);

  useEffect(() => {
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

  return (
    <div className="Explore">
      <NavBar currentAccount={currentAccount} />
      {!currentAccount && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleConnectWallet}>Connect Wallet</button>
        </div>
      )}
      <PollPreviewList 
        polls={polls} 
        isLoading={isLoading} 
        currentAccount={currentAccount} 
      />
    </div>
  );
}

export default Explore;