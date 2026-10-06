import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const KEY = 'raizes-matriz-auth'

export const matrizDemo = {
  email: 'matriz@raizesdonordeste.com',
  password: 'raizes2026',
}

type Auth = {
  email: string | null
  ready: boolean
  isIn: boolean
  login: (user: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<Auth | null>(null)

export function MatrizAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setEmail(localStorage.getItem(KEY))
    setReady(true)
  }, [])

  const value = useMemo<Auth>(
    () => ({
      email,
      ready,
      isIn: Boolean(email),
      login(user, password) {
        const ok = user.trim().toLowerCase() === matrizDemo.email && password === matrizDemo.password
        if (!ok) return false
        localStorage.setItem(KEY, matrizDemo.email)
        setEmail(matrizDemo.email)
        return true
      },
      logout() {
        localStorage.removeItem(KEY)
        setEmail(null)
      },
    }),
    [email, ready],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useMatrizAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useMatrizAuth fora do provider')
  return ctx
}
