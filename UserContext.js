import {createContext,useState, useEffect} from "react";
import axios from 'axios';
const UserType = createContext();

const UserContext = ({children}) => {
    const [userId,setUserId] = useState("");

    return (
        <UserType.Provider value={{userId,setUserId}}>
            {children}
        </UserType.Provider>
    )
}

export {UserType,UserContext};