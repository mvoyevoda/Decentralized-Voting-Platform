import { useNavigate } from "react-router-dom";

function PollPreview({ poll, index}) {

  const navigate = useNavigate();
  const goToDetails = () => {
    navigate(`/poll/${poll.pollId}`);
  };

  return (
    <div className="poll-preview" key={index} onClick={goToDetails}>
      <div className="poll-preview-header">
        <p>{poll.title}</p>
        <p>{poll.totalVotes} Votes</p>
      </div>
      <div className="poll-preview-options">
        {poll.options &&
          poll.options.map((option, i) => (
            <div key={i} className="option">
              <div style={{ width: "50%", textAlign: "center"}}>
                <p>{option}</p>
              </div>
              <div style={{ width: "50%", textAlign: "center"}}>
                <p>{poll.voteCounts ? poll.voteCounts[i] : 0}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PollPreview;