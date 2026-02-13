import { type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  makeStyles,
  Button,
  Body1,
  Caption1,
  Avatar,
  Tooltip,
} from '@fluentui/react-components'
import {
  HomeRegular,
  AddRegular,
  SignOutRegular,
} from '@fluentui/react-icons'
import { useAuth } from '../context/AuthContext'

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #102840 0%, #1E3A5F 40%, #0891B2 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 16px',
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
  },
  logoArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
    padding: '8px 0',
  },
  logoImg: {
    width: '100px',
    height: '100px',
    objectFit: 'contain' as const,
    marginBottom: '6px',
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
  },
  logoTitle: {
    color: 'white',
    fontWeight: 800,
    fontSize: '20px',
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: '0.5px',
  },
  logoTagline: {
    fontSize: '10px',
    color: '#F5A623',
    fontWeight: 600,
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    marginTop: '2px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    justifyContent: 'flex-start',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '8px',
    padding: '10px 12px',
    fontFamily: "'Poppins', sans-serif",
    ':hover': {
      background: 'rgba(255,255,255,0.15)',
      color: 'white',
    },
  },
  navItemActive: {
    justifyContent: 'flex-start',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    borderRadius: '8px',
    padding: '10px 12px',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
    boxShadow: 'inset 3px 0 0 #F97316',
  },
  userSection: {
    borderTop: '1px solid rgba(255,255,255,0.2)',
    paddingTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  main: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto' as const,
    background: '#FFF7ED',
  },
})

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeRegular /> },
    { path: '/create', label: 'Create Content', icon: <AddRegular /> },
  ]

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <div className={styles.logoArea}>
          <img src="/zava-logo.png" alt="Zava Travel" className={styles.logoImg} />
          <span className={styles.logoTitle}>Zava Travel</span>
          <span className={styles.logoTagline}>Budget Friendly Adventures</span>
        </div>

        <div className={styles.nav}>
          {navItems.map(item => (
            <Button
              key={item.path}
              appearance="transparent"
              icon={item.icon}
              className={location.pathname === item.path ? styles.navItemActive : styles.navItem}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className={styles.userSection}>
          <Avatar
            name={user?.displayName}
            initials={user?.avatar}
            color="brand"
            size={36}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Body1 style={{ color: 'white', fontWeight: 600, display: 'block' }}>
              {user?.displayName}
            </Body1>
            <Caption1 style={{ color: 'rgba(255,255,255,0.7)' }}>
              {user?.role}
            </Caption1>
          </div>
          <Tooltip content="Sign out" relationship="label">
            <Button
              appearance="transparent"
              icon={<SignOutRegular />}
              onClick={logout}
              style={{ color: 'rgba(255,255,255,0.8)' }}
            />
          </Tooltip>
        </div>
      </nav>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
