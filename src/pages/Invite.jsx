import CloseButton from "../components/CloseButton";
import InviteWindow from "../assets/img/Invite/invite_window.svg";
import InviteFriendsButton from "../assets/img/Invite/invite_friends_button.svg";
import InviteTermsWindow from "../assets/img/Invite/window_terms_for_refferals.svg"

const Invite = () => {

    const openExternalLink = (link) => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openLink(link);
        }
    };

    const getUserId = () => {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            return tg.initDataUnsafe?.user?.id;
        }
        return null;
    };

    const handleInviteClick = () => {
        const link = `https://t.me/share/url?text=&url=https://t.me/big_balls_birds_bot?start=${getUserId()}`;
        openExternalLink(link);
    };

    return (
        <div className="relative flex flex-col items-center justify-start h-screen w-screen max-w-[574px]">
            <header className="flex justify-end w-full p-4">
                <div role="button">
                    <CloseButton />
                </div>
            </header>
            <div className="relative flex flex-col items-center justify-start flex-1 mt-16">
                <div>
                    <img src={InviteWindow} alt="Invite window illustration" className="w-[392px] h-[349px]" />
                </div>
                    <div className="absolute top-[40px] text-3xl">My referrals</div>
                    <div className="absolute w-[265px] h-[108px] top-[100px]">
                            <div className="z-20 text-xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap">
                                <b>Bro = 150 $BALLS <br />
                                Bro’s buddy = 50 $BALLS
                                </b>
                            </div>
                            <img src={InviteTermsWindow} alt="" className="absolute w-[265px] h-[108px] top-0 z-10" />
                    </div>
                    
                    <button onClick={handleInviteClick} className="absolute w-[248px] h-[54px] top-[250px]">
                            <img
                                src={InviteFriendsButton}
                                alt="Invite Friends"
                                className="w-full h-full"
                            />
                        <div className="absolute inset-0 flex items-center justify-center text-black font-bold" style={{ fontSize: '24px' }}>
                            Invite
                        </div>
                    </button>
            </div>
        </div>
    );
}

export default Invite;
