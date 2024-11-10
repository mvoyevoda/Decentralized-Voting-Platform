import { useEffect, useState } from "react";
import { fetchPollPreviews } from "./blockchain";
import ViewPolls from "./components/PollPreviews";
// import VerifyVoter from "./components/VerifyVoter";

function App() {
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

  return (
    <div className="App">
      <div style={{ padding: "10px", backgroundColor: "#f0f0f0", marginBottom: "20px" }}>
        <strong>Current Account:</strong> {currentAccount || "Not connected"}
      </div>
      <h1>Decentralized Voting Platform</h1>
      {/* <VerifyVoter /> */}
      <ViewPolls polls={polls} isLoading={isLoading} />
    </div>
  );
}

export default App;