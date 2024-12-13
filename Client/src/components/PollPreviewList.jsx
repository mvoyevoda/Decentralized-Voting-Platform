import { useEffect, useState } from "react";
import { fetchPollDetails, fetchVoteCounts } from "../blockchain";
import PollPreview from "./PollPreview";

function PollPreviewList({ polls, isLoading, handleVote }) {
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
          <PollPreview key={index} index={index} poll={poll} handleVote={handleVote} />
        ))
      )}
    </div>
  );
}

export default PollPreviewList;