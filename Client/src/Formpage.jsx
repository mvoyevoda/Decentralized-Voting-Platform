import React, { useState } from "react";
import { addPoll } from '../../Blockchain/scripts/addPoll'

function FormPage() {
  const [pollName1, setPollName1] = useState('');
  const [pollDesc1, setPollDesc1] = useState('');
  const [startTime1, setStartTime1] = useState();
  const [endTime1, setEndTime1] = useState();
  const [currOption, setCurrOption] = useState('');
  const [options, setOptions] = useState([]);

  const addOption = (event) => {
    event.preventDefault();
    let newOptions = [...options];
    newOptions.push(currOption);
    console.log(options)
    setOptions(newOptions);
    setCurrOption('');
  }

  return (
    <div>
      <h1>Create a Poll</h1>
      <form>
        <label>
          Poll Name:
          <input type="text" value={pollName1} onChange={(e) => setPollName1(e.target.value)}/>
        </label>
        <br />
        <label>
          Poll Description:
          <input type="text" value={pollDesc1} onChange={(e) => setPollDesc1(e.target.value)}/>
        </label>
        <br />
        <label>
          Options:
          <input type="text" value={currOption} onChange={(e) => setCurrOption(e.target.value)}/>
          <button onClick={addOption}>Add</button>
        </label>
        <br/>
        <label>
          Start Time:
          <input type="text" value={startTime1} onChange={(e) => setStartTime1(e.target.value)}/>
        </label>
        <br/>
        <label>
          End Time:
          <input type="text" value={endTime1} onChange={(e) => setEndTime1(e.target.value)}/>
        </label>
        <p>
          {
            options.map((option, index) => (
              <div>
                <span key={index}>{option}</span>
                <br/>
              </div>
            ))
          }
        </p>

        <br />
        <br />
        <button onClick={(event) => addPoll(event, pollName1, pollDesc1, options, "", startTime1, endTime1)} type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormPage;

//title, desc, options, imageURLs