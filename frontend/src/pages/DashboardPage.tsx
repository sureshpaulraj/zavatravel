import { useNavigate } from 'react-router-dom'
import {
  Card,
  Title1,
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
    background: 'linear-gradient(135deg, #0891B2 0%, #1E3A5F 100%)',
    borderRadius: '16px',
    padding: '40px',
    color: 'white',
    marginBottom: '32px',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute' as const,
    right: '-40px',
    top: '-40px',
    fontSize: '200px',
    opacity: 0.1,
  },
  greeting: { fontSize: '14px', opacity: 0.8, marginBottom: '8px' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    padding: '24px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #E2E8F0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    },
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  agentSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '16px',
  },
  agentCard: {
    padding: '24px',
    borderRadius: '12px',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    transition: 'border-color 0.2s',
    ':hover': { borderBottomColor: '#0891B2' },
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
        <div className={styles.heroOverlay}>✈️</div>
        <div className={styles.greeting}>Welcome back, {user?.displayName}</div>
        <Title1 style={{ color: 'white', marginBottom: '8px' }}>
          Zava Travel Content Studio
        </Title1>
        <Body1 style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '600px', marginBottom: '24px' }}>
          Create platform-ready social media content with AI-powered multi-agent collaboration.
          Three specialized agents work together to draft, review, and publish your travel content.
        </Body1>
        <Button
          appearance="primary"
          icon={<AddRegular />}
          size="large"
          onClick={() => navigate('/create')}
          style={{ background: '#F97316', border: 'none' }}
        >
          Create New Content
        </Button>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STATS.map(s => (
          <Card key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <Title3 style={{ color: '#1E3A5F' }}>{s.value}</Title3>
              <Caption1 style={{ color: '#64748B' }}>{s.label}</Caption1>
            </div>
          </Card>
        ))}
      </div>

      {/* Agents */}
      <Title2 style={{ marginBottom: '4px' }}>🤖 Agent Team</Title2>
      <Body2 style={{ color: '#64748B', marginBottom: '16px' }}>
        Three specialized AI agents collaborate in a group chat to create your content
      </Body2>

      <div className={styles.agentSection}>
        {AGENTS.map(a => (
          <Card key={a.name} className={styles.agentCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>{a.emoji}</span>
              <div>
                <Title3>{a.name}</Title3>
                <Caption1 style={{ color: '#64748B' }}>{a.engine}</Caption1>
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
      <Title2 style={{ marginBottom: '16px' }}>🌍 Featured Destinations</Title2>
      <div className={styles.destinationGrid}>
        {DESTINATIONS.map(d => (
          <Badge
            key={d.name}
            appearance="outline"
            size="extra-large"
            style={{
              padding: '12px 20px',
              fontSize: '15px',
              borderColor: '#0891B2',
              color: '#1E3A5F',
              borderRadius: '12px',
            }}
          >
            {d.flag} {d.name} — from {d.price}
          </Badge>
        ))}
      </div>
    </div>
  )
}
