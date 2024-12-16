import { useState, useEffect } from "react";
import { uploadPoll, getCurrentAccount } from "../blockchain";
import NavBar from "../components/NavBar";

function CreatePoll() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [pollName1, setPollName1] = useState('');
  const [pollDesc1, setPollDesc1] = useState('');
  const [startTime1, setStartTime1] = useState('');
  const [endTime1, setEndTime1] = useState('');
  const [currOption, setCurrOption] = useState('');
  const [options, setOptions] = useState([]);
  const [currImageURL, setCurrImageURL] = useState('');

  useEffect(() => {
    async function loadAccount() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        setCurrentAccount(accounts[0]);

        window.ethereum.on("accountsChanged", (accounts) => {
          setCurrentAccount(accounts[0] || "");
        });
      } else {
        console.error("MetaMask not available.");
      }
    }

    loadAccount();
  }, []);

  const addOption = (event) => {
    event.preventDefault();
    if (!currOption || !currImageURL) {
      alert("Please provide both option text and image URL.");
      return;
    }
    let newOptions = [...options];
    newOptions.push({ option: currOption, imageURL: currImageURL });
    setOptions(newOptions);
    setCurrOption('');
    setCurrImageURL('');
  }

  const handleAddPoll = async (e) => {
    e.preventDefault();

    if (!pollName1 || !pollDesc1 || !startTime1 || !endTime1 || options.length < 2) {
      alert("Please fill all fields and add at least two options.");
      return;
    }

    const startTime = Math.floor(new Date(startTime1).getTime() / 1000);
    const endTime = Math.floor(new Date(endTime1).getTime() / 1000);

    if (startTime >= endTime) {
      alert("Start time must be before end time.");
      return;
    }

    const optionsArray = options.map(o => o.option);
    const imageURLsArray = options.map(o => o.imageURL);

    const account = await getCurrentAccount();
    if (!account) {
      alert("No account found. Please connect to MetaMask.");
      return;
    }

    const success = await uploadPoll(pollName1, pollDesc1, startTime, endTime, optionsArray, imageURLsArray, account);

    if (success) {
      alert("Poll created successfully!");
      setPollName1('');
      setPollDesc1('');
      setStartTime1('');
      setEndTime1('');
      setOptions([]);
    } else {
      alert("Failed to create poll.");
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '80px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const formContainerStyle = {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    backgroundColor: '#000000',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
    fontSize: '14px',
    marginBottom: '10px',
  };

  const submitButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#000000',
  };

  const optionContainerStyle = {
    backgroundColor: '#f3f4f6',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
  };

  return (
    <>
      <NavBar currentAccount={currentAccount} />
      <div style={containerStyle}>
        <div style={formContainerStyle}>
          <h1 style={headingStyle}>Create a Poll</h1>
          <form>
            <label style={labelStyle} htmlFor="pollName">Poll Name</label>
            <input
              id="pollName"
              type="text"
              value={pollName1}
              onChange={(e) => setPollName1(e.target.value)}
              placeholder="Enter poll name"
              style={inputStyle}
            />

            <label style={labelStyle} htmlFor="pollDesc">Poll Description</label>
            <textarea
              id="pollDesc"
              value={pollDesc1}
              onChange={(e) => setPollDesc1(e.target.value)}
              placeholder="Enter poll description"
              style={{...inputStyle, height: '100px'}}
            />

            <label style={labelStyle} htmlFor="currOption">Option Text</label>
            <input
              id="currOption"
              type="text"
              value={currOption}
              onChange={(e) => setCurrOption(e.target.value)}
              placeholder="Enter option text"
              style={inputStyle}
            />

            <label style={labelStyle} htmlFor="currImageURL">Image URL</label>
            <input
              id="currImageURL"
              type="text"
              value={currImageURL}
              onChange={(e) => setCurrImageURL(e.target.value)}
              placeholder="Enter image URL"
              style={inputStyle}
            />

            <button style={buttonStyle} onClick={addOption}>Add Option</button>

            <label style={labelStyle} htmlFor="startTime">Start Time</label>
            <input
              id="startTime"
              type="datetime-local"
              value={startTime1}
              onChange={(e) => setStartTime1(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle} htmlFor="endTime">End Time</label>
            <input
              id="endTime"
              type="datetime-local"
              value={endTime1}
              onChange={(e) => setEndTime1(e.target.value)}
              style={inputStyle}
            />

            <div style={{marginBottom: '20px'}}>
              <h3 style={{...labelStyle, marginTop: '20px'}}>Added Options:</h3>
              {options.map((optionObj, index) => (
                <div key={index} style={optionContainerStyle}>
                  <p style={{margin: '5px 0'}}><strong>Option:</strong> {optionObj.option}</p>
                  <p style={{margin: '5px 0'}}><strong>Image URL:</strong> {optionObj.imageURL}</p>
                </div>
              ))}
            </div>

            <button style={submitButtonStyle} onClick={(e) => handleAddPoll(e)} type="submit">
              Create Poll
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePoll;

