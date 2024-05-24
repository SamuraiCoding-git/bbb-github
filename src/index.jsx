import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Main from "./pages/Main";
import Leaderboard from "./pages/Leaderboard";
import Invite from "./pages/Invite";

function App() {
    return (
        <Router>
            <Toaster />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/leaderboard" element={<Leaderboard />}/>
                <Route path="/invite" element={< Invite/>}/>
            </Routes>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
