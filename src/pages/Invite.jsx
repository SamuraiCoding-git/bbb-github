import { useContext, useEffect, useState } from "react";
import InviteWindow from "../assets/back-paper-M.svg";
import InviteFriendsButton from "../assets/img/Invite/invite_friends_button.svg";
import { api } from "../api/interface"
import { id as userId } from "../utils/TelegramUserData"
import { HeaderContext } from "../components/Header";

const Invite = () => {
    const { setIsShowCloseBtn } = useContext(HeaderContext)

    const openExternalLink = (link) => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openLink(link);
        }
    };

    const handleInviteClick = () => {
        const link = `https://t.me/share/url?text=&url=https://t.me/big_balls_birds_bot?start=${userId}`;
        openExternalLink(link);
    };

    useEffect(() => {
        // Получить количество приглашенных пользователей и поинты с них
        setIsShowCloseBtn(true)

        return () => { setIsShowCloseBtn(false) }
    }, [])

    return (
        <div className="relative flex flex-col items-center justify-start h-screen w-screen max-w-[574px]">
            <div className="relative flex flex-col items-center justify-start flex-1 mt-32">
                <div>
                    <img src={InviteWindow} alt="Invite window illustration" className="w-[310px]" />
                </div>
                    <div className="absolute top-[40px] text-3xl">My referrals</div>
                    <div className="absolute w-[265px] h-[108px] top-[100px]">
                        <div className="z-20 text-xl relative text-nowrap w-auto px-6 mb-4">
                            <div className="flex flex-row justify-between">
                                <span>Invited</span>
                                <span>0</span>
                            </div>
                            <div className="flex flex-row justify-between">
                                <span>Points earned</span>
                                <span>0</span>
                            </div>
                        </div>
                        <hr width="95%" color="#313229" className="h-[3px] border-t-0 m-auto rounded-xl" />
                        <div className="z-20 text-xl relative text-nowrap w-auto px-6 mt-4">
                            <div className="flex flex-row justify-between">
                                <span>Bro</span>
                                <span>150 $BALLS</span>
                            </div>
                            <div className="flex flex-row justify-between">
                                <span>Bro’s buddy</span>
                                <span>50 $BALLS</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleInviteClick} className="absolute w-[248px] h-[54px] top-[280px]">
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
