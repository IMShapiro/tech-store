import { createContext, useState, useEffect } from "react"
import { auth } from "../config/FirebaseConfig";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsSignedIn(!!user); // If user exists, set to true, otherwise false
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    return (
        <UserContext.Provider value={{ isSignedIn }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;