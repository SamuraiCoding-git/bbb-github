import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Main from "./pages/Main";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Wallet from "./pages/Wallet";
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";
import Invite from "./pages/Invite";
import Durov from "./pages/Durov";
import Game from "./pages/Game";

function App() {
    return (
        <Router>
            <Toaster />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/invite" element={<Invite />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/game" element={<Game />} />
                <Route path="/durov" element={<Durov />}/>
            </Routes>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <TonConnectUIProvider
        manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
        uiPreferences={{ theme: THEME.DARK }}
        walletsListConfiguration={{
            includeWallets: [
                {
                    appName: "safepalwallet",
                    name: "SafePal",
                    imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
                    tondns: "",
                    aboutUrl: "https://www.safepal.com",
                    universalLink: "https://link.safepal.io/ton-connect",
                    jsBridgeKey: "safepalwallet",
                    bridgeUrl: "https://ton-bridge.safepal.com/tonbridge/v1/bridge",
                    platforms: ["ios", "android", "chrome", "firefox"]
                },
                {
                    appName: "tonwallet",
                    name: "TON Wallet",
                    imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
                    aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
                    universalLink: "https://wallet.ton.org/ton-connect",
                    jsBridgeKey: "tonwallet",
                    bridgeUrl: "https://bridge.tonapi.io/bridge",
                    platforms: ["chrome", "android"]
                }
            ]
        }}
        actionsConfiguration={{
            twaReturnUrl: 'https://t.me/DemoDappWithTonConnectBot/demo'
        }}
    >
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </TonConnectUIProvider>
);