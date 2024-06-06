import CloseButton from "../components/CloseButton";
import InviteWindow from "../assets/img/Invite/invite_window.svg";
import InviteFriendsButton from "../assets/img/Invite/invite_friends_button.svg";
import InviteTermsWindow from "../assets/img/Invite/window_terms_for_refferals.svg"

const Invite = () => {
    return (
        <div className="relative flex flex-col items-center justify-start h-screen w-screen max-w-[574px]">
            <header className="flex justify-end w-full p-4">
                <div role="button">
                    <CloseButton />
                </div>
            </header>
            <div className="relative flex flex-col items-center justify-start flex-1 mt-16">
                <img src={InviteWindow} alt="Invite window illustration" className="w-[392px] h-[349px]" />
                <div className="absolute w-[248px] h-[54px]" style={{ top: '45%' }}>
                    <img
                        src={InviteFriendsButton}
                        alt="Invite Friends"
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-black font-bold" style={{ fontSize: '24px' }}>
                        Invite
                    </div>
                </div>
                <img src={InviteTermsWindow} alt="" className="absolute w-[265px] h-[108px] top-[50px]"></img>
            </div>
        </div>
    );
}

export default Invite;
