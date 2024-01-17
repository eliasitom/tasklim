import { createContext, useState, useEffect } from "react";
import useMyUser from "../custom_hooks/useMyUser";

export const UserContext = createContext()


export const UserProvider = ({ children }) => {
  const [myUser, setMyUser] = useState(null)
  const myUserObject = useMyUser()

  useEffect(() => {
    if (myUserObject.loading) return

    if (!myUser) setMyUser(myUserObject.myUser)
  }, [myUserObject])


  return (
    <UserContext.Provider value={{ myUser, setMyUser }}>
      {children}
    </UserContext.Provider>
  )
}