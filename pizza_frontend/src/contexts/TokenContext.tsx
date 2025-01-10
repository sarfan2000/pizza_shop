import React, { createContext, useContext, useState } from 'react';

type TokenContextType = {
    userId: string | undefined;
    setUserId: (userId: string) => void;
    userEmail: string | undefined;
    setUserEmail: (email: string) => void;
};

export const TokenContext = createContext<TokenContextType>({} as TokenContextType);

export const useTokenContext = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error('useTokenContext must be used within a TokenProvider');
    }
    return context;
};

type TokenProviderProps = {
    children: React.ReactNode;
};

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<string | undefined>(localStorage.getItem('userId') ?? undefined);
    const [userEmail, setUserEmail] = useState<string | undefined>(localStorage.getItem('userEmail') ?? undefined);

    const contextValue: TokenContextType = {
        userId,
        setUserId,
        userEmail,
        setUserEmail
    };

    return <TokenContext.Provider value={contextValue}>{children}</TokenContext.Provider>;
};