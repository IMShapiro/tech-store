import { createContext } from "react"
import { useState } from "react"

export const UserContext =  createContext()

function UserContextProvider({children}){
    const [isSignedIn, setIsSignedIn] = useState(false);

    return (
        <UserContext.Provider value={{isSignedIn}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;