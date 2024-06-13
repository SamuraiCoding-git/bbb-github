import React, { useContext } from 'react';
import BackgroundMusic from "../BackgroundMusic";
import CloseButton from "../CloseButton";
import { HeaderContext } from './HeaderProvider';


export const Header = () => {
    const { isShowCloseBtn } = useContext(HeaderContext)

    return (
        <div className="relative z-20">
            <BackgroundMusic />
            { isShowCloseBtn && 
                <CloseButton/>
            }
        </div>
    )
};
