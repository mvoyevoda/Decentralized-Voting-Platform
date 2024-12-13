import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Explore from './routes/Explore';
import CreatePoll from "./routes/CreatePoll";
import PollDetails from './components/PollDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Explore/>}/>
          <Route path="/create-poll" element={<CreatePoll/>}/>
          <Route path="/poll/:pollId" element={<PollDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;