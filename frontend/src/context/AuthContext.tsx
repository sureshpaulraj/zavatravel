import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  username: string
  displayName: string
  role: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

// Demo accounts for the hackathon
export const DEMO_ACCOUNTS = [
  { username: 'sarah.explorer', password: 'zava2026', displayName: 'Sarah Chen', role: 'Content Lead', avatar: '🧭' },
  { username: 'marco.adventures', password: 'wander2026', displayName: 'Marco Rivera', role: 'Social Media Manager', avatar: '🌍' },
  { username: 'admin', password: 'admin', displayName: 'Zava Admin', role: 'Administrator', avatar: '⚙️' },
]

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (username: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS.find(
      a => a.username === username && a.password === password
    )
    if (account) {
      setUser({
        username: account.username,
        displayName: account.displayName,
        role: account.role,
        avatar: account.avatar,
      })
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  return (
    <AuthContext value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
