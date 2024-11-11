// import { useEffect, useState } from "react";
// import { fetchPollPreviews, castVote } from "./blockchain";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import ViewPolls from "./components/PollPreviews";
import HomePage from './pollinfo';
import FormPage from "./components/Formpage";
// import CreatePoll from "./components/CreatePoll";
// import VerifyVoter from "./components/VerifyVoter";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/pollform" element={<FormPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;