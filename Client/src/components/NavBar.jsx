import { useLocation } from "react-router-dom";

function NavBar({ currentAccount }) {

  const redirectToCreatePoll = () => {
    window.location.href = '/create-poll';
  };

  const redirectToHome = () => {
    window.location.href = '/';
  };

  return (
    <nav className="NavBar">
      {location.pathname !== '/create-poll' ? <button className="create-poll-button" onClick={redirectToCreatePoll}>Create Poll</button> : <div className="create-poll-button"></div>}
      <div className="logo">
        <h1 onClick={redirectToHome} style={{ margin: '0' }}>Decentralized Voting Platform</h1>
      </div>
      <div className="account-address">
        {currentAccount ? currentAccount.slice(0,4) + "..." + currentAccount.slice(-4) : "Not connected"}
      </div>
    </nav>
  );
}

export default NavBar;