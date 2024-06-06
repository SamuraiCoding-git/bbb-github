import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";

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