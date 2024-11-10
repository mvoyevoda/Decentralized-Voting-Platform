import { useEffect, useState } from "react";
import { fetchPollPreviews, fetchPollDetails, castVote } from "../blockchain";

function PollPreviews({ isLoading }) {
  const [polls, setPolls] = useState([]);
  const [detailedPolls, setDetailedPolls] = useState([]);

  // Load poll previews initially
  useEffect(() => {
    const loadPolls = async () => {
      const previews = await fetchPollPreviews();
      setPolls(previews);
    };
    loadPolls();
  }, []);

  // Load detailed data for each poll
  useEffect(() => {
    const loadPollDetails = async () => {
      const details = await Promise.all(
        polls.map(async (poll) => {
          const detail = await fetchPollDetails(poll.pollId);
          return { ...poll, ...detail };
        })
      );
      setDetailedPolls(details);
    };
    if (polls.length > 0) {
      loadPollDetails();
    }
  }, [polls]);

  const handleVote = async (pollId, optionIndex) => {
    console.log(`Vote cast for Poll ID: ${pollId}, Option: ${optionIndex}`);
    const success = await castVote(pollId, optionIndex);
    if (success) {
      alert("Vote cast successfully!");

      // Reload poll details for this poll to update the vote count
      const updatedPollDetails = await fetchPollDetails(pollId);
      setDetailedPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.pollId === pollId ? { ...poll, ...updatedPollDetails } : poll
        )
      );
    } else {
      alert("Failed to cast vote. Please try again.");
    }
  };

  return (
    <div>
      <h2>Poll Previews</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        detailedPolls.length > 0 &&
        detailedPolls.map((poll, index) => (
          <div className="poll-preview" key={index} style={{ marginBottom: "20px" }}>
            <p>{poll.title}</p>
            <p>Active: {poll.isActive ? "Yes" : "No"}</p>
            <p>Total Votes: {poll.totalVotes}</p>
            <div className="options-container" style={{ display: "flex", gap: "20px" }}>
              {poll.options &&
                poll.options.map((option, i) => (
                  <div key={i} className="option" style={{ border: "1px solid navy", padding: "10px", textAlign: "center" }}>
                    <p>{option}</p>
                    <button onClick={() => handleVote(poll.pollId, i)}>Vote</button>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PollPreviews;