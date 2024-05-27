import CloseButton from "../components/CloseButton";
import {TonConnectButton} from "@tonconnect/ui-react";

const Wallet = () => {
    return (
        <>
            <div className="close-button" id="wallet">
                <CloseButton />
            </div>
            <div className="ton-connect">
                <TonConnectButton />
            </div>
        </>
    )
}

export default Wallet;