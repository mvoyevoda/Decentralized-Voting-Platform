function ViewPolls({ polls, isLoading }) {
  return (
    <div>
      <h2>Poll Previews</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        Array.isArray(polls) &&
        polls.map((poll, index) => (
          <div className="poll-preview" key={index}>
            <p>{poll.title}</p>
            <p>Active: {poll.isActive ? "Yes" : "No"}</p>
            <p>Total Votes: {poll.totalVotes}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewPolls;