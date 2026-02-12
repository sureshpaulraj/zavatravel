import { type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  makeStyles,
  Button,
  Title3,
  Body1,
  Caption1,
  Avatar,
  Tooltip,
} from '@fluentui/react-components'
import {
  AirplaneRegular,
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
    background: 'linear-gradient(180deg, #1E3A5F 0%, #0891B2 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    marginBottom: '32px',
  },
  logoText: {
    color: 'white',
    fontWeight: 700,
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
        <div className={styles.logo}>
          <AirplaneRegular style={{ fontSize: '28px' }} />
          <Title3 className={styles.logoText}>Zava Travel</Title3>
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
