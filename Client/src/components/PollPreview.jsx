import { useNavigate } from "react-router-dom";

function PollPreview({ poll, index, handleVote }) {

  const navigate = useNavigate();
  const goToDetails = () => {
    navigate(`/poll/${poll.pollId}`);
  };

  return (
    <div className="poll-preview" key={index} style={{ marginBottom: "20px" } }>
      <p onClick={goToDetails} style={{ cursor: 'pointer' }}>{poll.title}</p>
      <p>Active: {poll.isActive ? "Yes" : "No"}</p>
      <p>Total Votes: {poll.totalVotes}</p>
      <div className="options-container" style={{ display: "flex", gap: "20px" }}>
        {poll.options &&
          poll.options.map((option, i) => (
            <div key={i} className="option" style={{ border: "1px solid navy", padding: "10px", textAlign: "center" }}>
              <p>{option}</p>
              <p>Votes: {poll.voteCounts ? poll.voteCounts[i] : 0}</p>
              <button 
                onClick={() => handleVote(Number(poll.pollId), Number(i))}
              >
                Vote
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PollPreview;