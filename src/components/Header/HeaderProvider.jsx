import { createContext, useMemo, useState } from "react";

export const HeaderContext = createContext({})

export const HeaderProvider = ({ children }) => {
    const [isShowCloseBtn, setIsShowCloseBtn] = useState(false)

    const defaultProps = useMemo(() => ({
        isShowCloseBtn,
        setIsShowCloseBtn
    }), [isShowCloseBtn])

    return (
        <HeaderContext.Provider value={defaultProps}>
            { children }
        </HeaderContext.Provider>
    )
}
