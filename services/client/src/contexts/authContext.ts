import React from "react"
import {type User} from "firebase/auth"

/**
 * React user context type
 */
export interface Context {
    currentUser: undefined | User
}

export const AuthContext = React.createContext<Context>({
    currentUser: undefined,
})

export default AuthContext
