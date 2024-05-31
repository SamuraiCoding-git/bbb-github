import CloseButton from "../components/CloseButton";
import {TonConnectButton} from "@tonconnect/ui-react";

const Wallet = () => {
    return (
        <div className="relative max-w-[320px] h-screen w-screen ml-[200px]">
            <div className="close-button" id="wallet">
                <CloseButton />
            </div>
            <div className="ton-connect">
                <TonConnectButton />
            </div>
        </div>
    )
}

export default Wallet;