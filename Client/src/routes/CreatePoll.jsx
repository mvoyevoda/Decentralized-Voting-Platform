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

  return (
    <div className="create-poll-container">
      <NavBar currentAccount={currentAccount} />
      <div className="create-poll-content">
        <h1>Create a Poll</h1>
        <form>
          <label>
            Poll Name:
            <input type="text" value={pollName1} onChange={(e) => setPollName1(e.target.value)} />
          </label>
          <br />
          <label>
            Poll Description:
            <input type="text" value={pollDesc1} onChange={(e) => setPollDesc1(e.target.value)} />
          </label>
          <br />
          <label>
            Option Text:
            <input type="text" value={currOption} onChange={(e) => setCurrOption(e.target.value)} />
          </label>
          <br />
          <label>
            Image URL:
            <input type="text" value={currImageURL} onChange={(e) => setCurrImageURL(e.target.value)} />
          </label>
          <br />
          <button onClick={addOption}>Add Option</button>
          <br />
          <label>
            Start Time:
            <input type="datetime-local" value={startTime1} onChange={(e) => setStartTime1(e.target.value)} />
          </label>
          <br />
          <label>
            End Time:
            <input type="datetime-local" value={endTime1} onChange={(e) => setEndTime1(e.target.value)} />
          </label>
          <p>
            {options.map((optionObj, index) => (
              <div key={index}>
                <span>Option: {optionObj.option}</span>
                <br />
                <span>Image URL: {optionObj.imageURL}</span>
                <br />
              </div>
            ))}
          </p>
          <br />
          <br />
          <button onClick={(e) => handleAddPoll(e)} type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePoll;
