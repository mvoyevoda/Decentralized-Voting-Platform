import { useEffect, useState } from "react";
import { fetchPollDetails, fetchVoteCounts } from "../blockchain";

function PollPreviews({ polls, isLoading, handleVote }) {
  const [detailedPolls, setDetailedPolls] = useState([]);

  // Load detailed data for each poll and vote counts
  useEffect(() => {
    const loadPollDetails = async () => {
      const details = await Promise.all(
        polls.map(async (poll) => {
          const detail = await fetchPollDetails(poll.pollId);
          const voteCounts = await fetchVoteCounts(poll.pollId); // Fetch vote counts
          return { ...poll, ...detail, voteCounts }; // Merge voteCounts into poll details
        })
      );
      setDetailedPolls(details);
    };
    if (polls.length > 0) {
      loadPollDetails();
    }
  }, [polls]);

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
                    <p>Votes: {poll.voteCounts ? poll.voteCounts[i] : 0}</p> {/* Display each option's vote count */}
                    <button 
                      onClick={() => handleVote(Number(poll.pollId), Number(i))}
                    >
                      Vote
                    </button>
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