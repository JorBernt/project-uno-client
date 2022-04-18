import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from "./components/containers/LandingPage";
import GamePage from "./components/containers/GamePage";

function App() {
    const roomId = "abc";
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<LandingPage />}/>
                <Route exact path="/game/room/:roomId" element={<GamePage />}/>
            </Routes>
        </Router>
    );
}

export default App;
