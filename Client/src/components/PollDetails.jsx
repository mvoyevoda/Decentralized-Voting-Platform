import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchPollDetails } from '../blockchain'; 
import PollPreview from './PollPreview';

function PollDetails() {
  const { pollId } = useParams(); // Extract pollId from the URL
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch poll data based on pollId
    const getPoll = async () => {
      try {
        const data = await fetchPollDetails(pollId);
        setPoll(data);
      } catch (error) {
        console.error("Error fetching poll:", error);
      } finally {
        setLoading(false);
      }
    };

    getPoll();
  }, [pollId]);

  if (loading) {
    return <div>Loading poll...</div>;
  }

  if (!poll) {
    return <div>Poll not found.</div>;
  }

  return (
    <div className="poll-detail">
      <button><Link to="/">Return to Explore</Link></button>
      < PollPreview poll={poll} />
    </div>
  );
}

export default PollDetails; 