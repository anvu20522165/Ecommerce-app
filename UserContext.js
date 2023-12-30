import {createContext,useState, useEffect} from "react";
import axios from 'axios';
const UserType = createContext();

const UserContext = ({children}) => {
    const [userId,setUserId] = useState("");
    const [cartNumber, setCartNumber] = useState(0);
    return (
        <UserType.Provider value={{userId,setUserId,setCartNumber, cartNumber}}>
            {children}
        </UserType.Provider>
    )
}

export {UserType,UserContext};