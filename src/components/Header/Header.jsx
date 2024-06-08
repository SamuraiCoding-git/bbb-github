import React, { useContext } from 'react';
import BackgroundMusic from "../BackgroundMusic";
import CloseButton from "../CloseButton";
import { HeaderContext } from './HeaderProvider';


export const Header = () => {
    const { isShowCloseBtn } = useContext(HeaderContext)

    return (
        <div className="relative">
            <BackgroundMusic />
            { isShowCloseBtn && 
                <CloseButton/>
            }
        </div>
    )
};
