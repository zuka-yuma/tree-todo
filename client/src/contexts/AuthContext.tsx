import { useState, createContext, useContext, useEffect, type ReactNode } from "react";
import type { User } from "../types";
import { refresh } from "../api/client";
import * as authApi from "../api/auth";

interface IAuthContext {
    user: User | null | undefined
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, name: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<IAuthContext>({
    user: undefined,
    loading: true,
    login: async () => {},
    register: async () => {},
    logout: async () => {}
})

export const AuthProvider = ( props: { children: ReactNode } ) => {
    const [user, setUser] = useState<User | null | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)

    async function login(email: string, password: string) {
        await authApi.login(email, password)
        const me = await authApi.getMe()
        setUser(me)
    }

    async function register(email: string, name: string, password: string) {
        await authApi.register(email, name, password)
        const me = await authApi.getMe()
        setUser(me)
    }

    async function logout() {
        try {
            await authApi.logout()
        } finally {
            setUser(null)
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                await refresh()
                const me = await authApi.getMe()
                setUser(me)
            } catch {}
            setLoading(false)
        } 
        init()
    }, [])

    return (
        <AuthContext.Provider 
            value={{
                user,
                loading,
                login,
                register,
                logout,
            }}>
            {props.children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => useContext(AuthContext)