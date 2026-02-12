import { useState } from 'react'
import {
  Card,
  Input,
  Button,
  Title1,
  Body1,
  Caption1,
  Divider,
  MessageBar,
  MessageBarBody,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  PersonRegular,
  LockClosedRegular,
  AirplaneRegular,
  EyeOffRegular,
  EyeRegular,
} from '@fluentui/react-icons'
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext'

const useStyles = makeStyles({
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #0891B2 0%, #1E3A5F 50%, #F97316 100%)',
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
    color: 'white',
    '@media (max-width: 768px)': { display: 'none' },
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 700,
    marginBottom: '16px',
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  heroSubtitle: {
    fontSize: '20px',
    opacity: 0.9,
    maxWidth: '400px',
    textAlign: 'center' as const,
    lineHeight: '1.6',
  },
  destinations: {
    display: 'flex',
    gap: '12px',
    marginTop: '32px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: '36px',
    color: '#0891B2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '24px',
  },
  demoSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#F0FDFF',
    borderRadius: '8px',
    border: '1px solid #0891B220',
  },
  demoAccount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    cursor: 'pointer',
    '&:hover': { opacity: 0.7 },
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '16px',
    color: tokens.colorNeutralForeground3,
  },
})

export default function LoginPage() {
  const styles = useStyles()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!login(username, password)) {
      setError('Invalid username or password. Try a demo account below.')
    }
  }

  const fillDemo = (u: string, p: string) => {
    setUsername(u)
    setPassword(p)
    setError('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✈️</div>
        <div className={styles.heroTitle}>Zava Travel</div>
        <div className={styles.heroSubtitle}>
          Wander More, Spend Less — AI-powered social media content creation for adventure travel
        </div>
        <div className={styles.destinations}>
          {['🇮🇩 Bali', '🇦🇷 Patagonia', '🇮🇸 Iceland', '🇻🇳 Vietnam', '🇨🇷 Costa Rica'].map(d => (
            <Badge key={d} appearance="filled" color="subtle" size="large"
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', fontSize: '14px' }}>
              {d}
            </Badge>
          ))}
        </div>
      </div>

      <div className={styles.rightPanel}>
        <Card className={styles.loginCard}>
          <div className={styles.logo}>
            <AirplaneRegular className={styles.logoIcon} />
            <Title1 style={{ color: '#1E3A5F' }}>Zava Travel</Title1>
          </div>
          <Body1 style={{ textAlign: 'center', color: '#64748B' }}>
            Social Media Content Studio
          </Body1>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <MessageBar intent="error">
                <MessageBarBody>{error}</MessageBarBody>
              </MessageBar>
            )}

            <Input
              placeholder="Username"
              value={username}
              onChange={(_, d) => setUsername(d.value)}
              contentBefore={<PersonRegular />}
              size="large"
              required
            />

            <Input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(_, d) => setPassword(d.value)}
              contentBefore={<LockClosedRegular />}
              contentAfter={
                <Button
                  appearance="transparent"
                  icon={showPassword ? <EyeOffRegular /> : <EyeRegular />}
                  onClick={() => setShowPassword(!showPassword)}
                  size="small"
                />
              }
              size="large"
              required
            />

            <Button
              appearance="primary"
              type="submit"
              size="large"
              style={{ background: '#0891B2', marginTop: '8px' }}
            >
              Sign In
            </Button>
          </form>

          <Divider style={{ margin: '24px 0 0' }}>Demo Accounts</Divider>

          <div className={styles.demoSection}>
            {DEMO_ACCOUNTS.map(acc => (
              <div
                key={acc.username}
                className={styles.demoAccount}
                onClick={() => fillDemo(acc.username, acc.password)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{acc.avatar}</span>
                  <div>
                    <Body1 style={{ fontWeight: 600 }}>{acc.displayName}</Body1>
                    <Caption1 style={{ color: '#64748B' }}>{acc.role}</Caption1>
                  </div>
                </div>
                <Caption1 style={{ fontFamily: 'monospace', color: '#0891B2' }}>
                  {acc.username}
                </Caption1>
              </div>
            ))}
            <Caption1 style={{ display: 'block', marginTop: '8px', color: '#94A3B8', textAlign: 'center' }}>
              Click an account to auto-fill credentials
            </Caption1>
          </div>

          <div className={styles.footer}>
            <Caption1>TechConnect Hackathon 2026 • Reasoning Agents Track</Caption1>
          </div>
        </Card>
      </div>
    </div>
  )
}
