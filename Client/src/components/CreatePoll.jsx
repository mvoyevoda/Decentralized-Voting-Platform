import { useState } from "react";
import { createPoll } from "../blockchain";

function CreatePoll({ refreshPolls }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [imageURLs, setImageURLs] = useState(["", ""]);

  const handleCreatePoll = async () => {
    const success = await createPoll(title, desc, options, imageURLs);
    if (success) {
      refreshPolls();
    }
  };

  return (
    <div>
      <h2>Create a Poll</h2>
      <input
        type="text"
        placeholder="Poll Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Poll Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) =>
              setOptions((opts) =>
                opts.map((opt, i) => (i === index ? e.target.value : opt))
              )
            }
          />
        ))}
        {imageURLs.map((url, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Image URL ${index + 1}`}
            value={url}
            onChange={(e) =>
              setImageURLs((urls) =>
                urls.map((url, i) => (i === index ? e.target.value : url))
              )
            }
          />
        ))}
      </div>
      <button onClick={handleCreatePoll}>Create Poll</button>
    </div>
  );
}

export default CreatePoll;