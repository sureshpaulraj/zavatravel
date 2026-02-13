import { useNavigate } from 'react-router-dom'
import {
  Card,
  Title2,
  Title3,
  Body1,
  Body2,
  Caption1,
  Button,
  Badge,
  Divider,
  makeStyles,
} from '@fluentui/react-components'
import {
  AddRegular,
  PeopleTeamRegular,
  BrainCircuitRegular,
  GlobeRegular,
  ShieldCheckmarkRegular,
} from '@fluentui/react-icons'
import { useAuth } from '../context/AuthContext'

const useStyles = makeStyles({
  page: { maxWidth: '1200px', margin: '0 auto' },
  hero: {
    background: 'linear-gradient(135deg, #1E3A5F 0%, #0891B2 60%, #F97316 100%)',
    borderRadius: '20px',
    padding: '44px 48px',
    color: 'white',
    marginBottom: '32px',
    position: 'relative' as const,
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(30, 58, 95, 0.25)',
  },
  heroBg: {
    position: 'absolute' as const,
    right: '-10px',
    top: '-10px',
    width: '220px',
    height: '220px',
    objectFit: 'contain' as const,
    opacity: 0.15,
    filter: 'brightness(2) contrast(0.8)',
    pointerEvents: 'none' as const,
  },
  greeting: { fontSize: '14px', opacity: 0.85, marginBottom: '8px', fontFamily: "'Poppins', sans-serif", fontWeight: 500 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    padding: '14px 20px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    border: '1px solid #E2E8F0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
    },
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  agentSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '16px',
  },
  agentCard: {
    padding: '28px',
    borderRadius: '14px',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    transition: 'all 0.2s ease',
    ':hover': { borderLeftColor: '#D63B2F', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
  },
  agentBadge: {
    display: 'inline-flex',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '12px',
  },
  destinationGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
    marginTop: '12px',
  },
})

const STATS = [
  { label: 'Agents Active', value: '3', icon: <PeopleTeamRegular />, color: '#0891B2', bg: '#F0FDFF' },
  { label: 'Reasoning Patterns', value: '3', icon: <BrainCircuitRegular />, color: '#F97316', bg: '#FFF7ED' },
  { label: 'Platforms', value: '3', icon: <GlobeRegular />, color: '#059669', bg: '#F0FDF4' },
  { label: 'Security Status', value: '✓ Secure', icon: <ShieldCheckmarkRegular />, color: '#7C3AED', bg: '#F5F3FF' },
]

const AGENTS = [
  {
    name: 'Creator',
    engine: 'Azure OpenAI',
    pattern: 'Chain-of-Thought',
    desc: 'Drafts compelling travel content using 5-step reasoning: Objective → Audience → Hook → Body → CTA',
    color: '#0891B2',
    bg: '#F0FDFF',
    emoji: '✍️',
  },
  {
    name: 'Reviewer',
    engine: 'GitHub Copilot',
    pattern: 'ReAct',
    desc: 'Reviews brand alignment using Observe → Think → Act → Result pattern. Approves or requests revisions.',
    color: '#F97316',
    bg: '#FFF7ED',
    emoji: '🔍',
  },
  {
    name: 'Publisher',
    engine: 'Azure OpenAI',
    pattern: 'Self-Reflection',
    desc: 'Formats for LinkedIn, Twitter & Instagram with platform validation and constraint checking.',
    color: '#059669',
    bg: '#F0FDF4',
    emoji: '📤',
  },
]

const DESTINATIONS = [
  { name: 'Bali', flag: '🇮🇩', price: '$899' },
  { name: 'Patagonia', flag: '🇦🇷', price: '$1,499' },
  { name: 'Iceland', flag: '🇮🇸', price: '$1,299' },
  { name: 'Vietnam', flag: '🇻🇳', price: '$699' },
  { name: 'Costa Rica', flag: '🇨🇷', price: '$799' },
]

export default function DashboardPage() {
  const styles = useStyles()
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <img src="/zava-logo.png" alt="" className={styles.heroBg} />
        <div className={styles.greeting}>Welcome back, {user?.displayName}</div>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '36px', color: 'white', marginBottom: '4px', lineHeight: 1.2 }}>
          Zava Travel{' '}
          <span style={{ color: '#D63B2F', fontSize: '40px' }}>Content</span>{' '}
          <span style={{ color: '#F5A623', fontSize: '32px' }}>Studio</span>
        </div>
        <div style={{ color: '#D63B2F', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' as const, fontFamily: "'Poppins', sans-serif", marginBottom: '16px' }}>
          Budget Friendly Adventures
        </div>
        <Body1 style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '600px', marginBottom: '28px' }}>
          Create platform-ready social media content with AI-powered multi-agent collaboration.
          Three specialized agents work together to draft, review, and publish your travel content.
        </Body1>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button
          appearance="primary"
          icon={<AddRegular />}
          size="large"
          onClick={() => navigate('/create')}
          style={{
            background: 'linear-gradient(135deg, #F97316 0%, #D63B2F 100%)',
            border: 'none',
            fontWeight: 700,
            fontSize: '15px',
            padding: '12px 28px',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(249,115,22,0.4)',
          }}
        >
          Create New Content
        </Button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STATS.map(s => (
          <Card key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <Title3 style={{ color: '#1E3A5F', display: 'block', marginBottom: '4px' }}>{s.value}</Title3>
              <Caption1 style={{ color: '#64748B', display: 'block' }}>{s.label}</Caption1>
            </div>
          </Card>
        ))}
      </div>

      {/* Agents */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
        <Title2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>🤖 Agent Team</Title2>
        <span style={{ color: '#D63B2F', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const }}>
          AI-Powered
        </span>
      </div>
      <Body2 style={{ color: '#64748B', marginBottom: '16px' }}>
        Three specialized AI agents collaborate in a group chat to create your content
      </Body2>

      <div className={styles.agentSection}>
        {AGENTS.map(a => (
          <Card key={a.name} className={styles.agentCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>{a.emoji}</span>
              <div>
                <Title3 style={{ display: 'block', marginBottom: '2px' }}>{a.name}</Title3>
                <Caption1 style={{ color: '#64748B', display: 'block' }}>{a.engine}</Caption1>
              </div>
            </div>
            <div className={styles.agentBadge} style={{ background: a.bg, color: a.color }}>
              {a.pattern}
            </div>
            <Body2 style={{ color: '#475569' }}>{a.desc}</Body2>
          </Card>
        ))}
      </div>

      <Divider style={{ margin: '32px 0' }} />

      {/* Destinations */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
        <Title2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>🌍 Featured Destinations</Title2>
        <span style={{ color: '#D63B2F', fontSize: '18px', fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>
          Explore
        </span>
      </div>
      <div className={styles.destinationGrid}>
        {DESTINATIONS.map(d => (
          <Badge
            key={d.name}
            appearance="outline"
            size="extra-large"
            style={{
              padding: '14px 22px',
              fontSize: '15px',
              borderColor: '#0891B2',
              color: '#1E3A5F',
              borderRadius: '12px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {d.flag} {d.name} — <span style={{ color: '#D63B2F', fontWeight: 700 }}>from {d.price}</span>
          </Badge>
        ))}
      </div>
    </div>
  )
}
