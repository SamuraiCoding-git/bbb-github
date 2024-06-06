import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { isMobileDevice } from './utils';
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Wallet from "./pages/Wallet";
import Invite from "./pages/Invite";
import Durov from "./pages/Durov";
import Game from "./pages/Game";
import { MusicProvider } from "./components/MusicContext";
import GameInterface from "./components/GameInterface";
import BackgroundMusic from "./components/BackgroundMusic";
import CloseButton from "./components/CloseButton";
import OnlyMobile from "./pages/OnlyMobile";

function App() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);

    // if (!isMobile) {
    //     return (
    //         <OnlyMobile/>
    //     );
    // }

    return (
        <MusicProvider>
            <Router>
                <BackgroundMusic />
                <Toaster />
                <Routes>
                    <Route path="/durov" element={<Durov />} />
                    <Route path="/" element={<GameInterface />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/invite" element={<Invite />} />
                    <Route path="/wallet" element={<Wallet />} />
                </Routes>
            </Router>
        </MusicProvider>
    );
}

export default App;