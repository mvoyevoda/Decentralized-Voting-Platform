import { useEffect, useState } from "react";
import Web3 from "web3";
import CounterABI from "./CounterABI.json";

function App() {
  const [count, setCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadWeb3AndContract = async () => {
    // Initialize Web3
    const web3 = new Web3(import.meta.env.VITE_NETWORK_URL);

    // Get the Counter contract instance
    const counterContract = new web3.eth.Contract(
      CounterABI,
      import.meta.env.VITE_CONTRACT_ADDRESS
    );

    return { web3, counterContract };
  };

  const fetchCount = async () => {
    setIsLoading(true);
    const { counterContract } = await loadWeb3AndContract();
    try {
      const currentCount = await counterContract.methods.count().call();
      console.log("Fetched count from chain:", currentCount);
      setCount(currentCount.toString()); // Convert BigInt to string
    } catch (error) {
      console.error("Error fetching count:", error);
    }
    setIsLoading(false);
  };  

  const incrementCount = async () => {
    setIsLoading(true);
    const { web3, counterContract } = await loadWeb3AndContract();

    try {
      // Use the first available account for sending the transaction
      const accounts = await web3.eth.getAccounts();
      await counterContract.methods.increment().send({ from: accounts[0] });
      fetchCount(); // Refresh the count after incrementing
    } catch (error) {
      console.error("Error incrementing count:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCount(); // Load the initial count on component mount
  }, []);

  return (
    <div className="App">
      <h1>Blockchain Counter</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>Count on Chain: {count}</p>
      )}
      <button onClick={incrementCount} disabled={isLoading}>
        Increment Counter
      </button>
    </div>
  );
}

export default App;
