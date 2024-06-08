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
import { Header, HeaderProvider } from "./components/Header";
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
            <HeaderProvider>
                <Router>
                    <Header/>
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
            </HeaderProvider>
        </MusicProvider>
    );
}

export default App;