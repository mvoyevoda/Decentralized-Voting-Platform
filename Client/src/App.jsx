import { useEffect, useState } from "react";
// import CreatePoll from "./components/CreatePoll";
import ViewPolls from "./components/PollPreviews";
import { fetchPollPreviews } from "./blockchain";

function App() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPolls() {
      const pollData = await fetchPollPreviews();
      setPolls(pollData);
      setIsLoading(false);
    }

    loadPolls();
  }, []); // Ensures loadPolls runs only once on mount

  return (
    <div className="App">
      <h1>Decentralized Voting Platform</h1>
      <ViewPolls polls={polls} isLoading={isLoading} />
    </div>
  );
}

export default App;