import React from "react";

function FormPage() {
  return (
    <div>
      <h1>Form Page</h1>
      <form>
        <label>
          Title:
          <input type="PollID" name="ID:" />
        </label>
        <br />
        <label>
          Description:
          <input type="email" name="email" />
        </label>
        <br />
        <label>
          Options:
          <input type="email" name="email" />
        </label>
        <br />
        <label>
          ImageURL:
          <input type="email" name="email" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormPage;

//title, desc, options, imageURLs