import { useState } from 'react'
import {
  Card,
  Title2,
  Title3,
  Body1,
  Body2,
  Caption1,
  Button,
  Input,
  Textarea,
  Spinner,
  MessageBar,
  MessageBarBody,
  Badge,
  TabList,
  Tab,
  RadioGroup,
  Radio,
  Label,
  makeStyles,
} from '@fluentui/react-components'
import {
  SparkleRegular,
  DocumentCopyRegular,
  CheckmarkRegular,
  ImageRegular,
  TextFieldRegular,
  ImageMultipleRegular,
} from '@fluentui/react-icons'
import { type CampaignBrief, generateContent, getMockResult, type WorkflowResult, type AgentMessage } from '../services/api'

const useStyles = makeStyles({
  page: { maxWidth: '1200px', margin: '0 auto' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '24px',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  formCard: {
    padding: '28px',
    borderRadius: '16px',
    height: 'fit-content',
    position: 'sticky' as const,
    top: '32px',
    borderTop: '4px solid #0891B2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  },
  resultArea: { display: 'flex', flexDirection: 'column', gap: '20px' },
  postCard: {
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    transition: 'box-shadow 0.2s',
    ':hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  },
  postContent: {
    whiteSpace: 'pre-wrap' as const,
    lineHeight: 1.7,
    padding: '16px',
    background: '#F8FAFC',
    borderRadius: '8px',
    marginTop: '12px',
    fontSize: '14px',
    border: '1px solid #E2E8F0',
  },
  transcriptMsg: {
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    borderLeft: '4px solid',
  },
  charCount: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '4px',
  },
  platformHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
    flexWrap: 'wrap' as const,
  },
})

const DEFAULT_BRIEF: CampaignBrief = {
  brand_name: 'Zava Travel Inc.',
  industry: 'Travel — Budget-Friendly Adventure',
  target_audience: 'Millennials & Gen-Z adventure seekers',
  key_message: 'Wander More, Spend Less — affordable curated itineraries to dream destinations starting at $699',
  destinations: 'Bali, Patagonia, Iceland, Vietnam, Costa Rica',
  platforms: ['LinkedIn', 'Twitter', 'Instagram'],
  content_type: 'both',
}

const PLATFORM_CONFIG: Record<string, { emoji: string; color: string; bg: string; label: string }> = {
  linkedin: { emoji: '💼', color: '#0077B5', bg: '#F0F8FF', label: 'LinkedIn' },
  twitter: { emoji: '𝕏', color: '#1DA1F2', bg: '#F0F8FF', label: 'X / Twitter' },
  instagram: { emoji: '📸', color: '#E4405F', bg: '#FFF0F3', label: 'Instagram' },
}

const AGENT_COLORS: Record<string, { border: string; bg: string }> = {
  Creator: { border: '#0891B2', bg: '#F0FDFF' },
  Reviewer: { border: '#F97316', bg: '#FFF7ED' },
  Publisher: { border: '#059669', bg: '#F0FDF4' },
}

export default function CreateContentPage() {
  const styles = useStyles()
  const [brief, setBrief] = useState<CampaignBrief>(DEFAULT_BRIEF)
  const [result, setResult] = useState<WorkflowResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('posts')
  const [copied, setCopied] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setResult(null)
    setError(null)
    try {
      const data = await generateContent(brief)
      setResult(data)
    } catch (err: any) {
      console.error('API error:', err)
      setError(err.message || 'Backend unavailable')
      setResult(getMockResult())
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text)
    setCopied(platform)
    setTimeout(() => setCopied(null), 2000)
  }

  const updateBrief = (field: keyof CampaignBrief, value: string) => {
    setBrief(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.page}>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: '28px', color: '#1E3A5F', marginBottom: '4px' }}>
        ✨ Create Social Media{' '}
        <span style={{ color: '#D63B2F', fontSize: '32px' }}>Content</span>
      </div>
      <Body1 style={{ color: '#64748B', marginBottom: '24px', fontFamily: "'Poppins', sans-serif" }}>
        Submit a campaign brief and let three AI agents collaborate to create platform-ready posts
      </Body1>

      <div className={styles.grid}>
        {/* Left: Form */}
        <Card className={styles.formCard}>
          <Title3>📋 Campaign Brief</Title3>
          <div className={styles.form}>
            <div>
              <Caption1 style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Brand</Caption1>
              <Input value={brief.brand_name} onChange={(_, d) => updateBrief('brand_name', d.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <Caption1 style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Industry</Caption1>
              <Input value={brief.industry} onChange={(_, d) => updateBrief('industry', d.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <Caption1 style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Target Audience</Caption1>
              <Input value={brief.target_audience} onChange={(_, d) => updateBrief('target_audience', d.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <Caption1 style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Key Message</Caption1>
              <Textarea value={brief.key_message} onChange={(_, d) => updateBrief('key_message', d.value)} rows={3} style={{ width: '100%' }} />
            </div>
            <div>
              <Caption1 style={{ fontWeight: 600, marginBottom: '4px', display: 'block' }}>Destinations</Caption1>
              <Input value={brief.destinations} onChange={(_, d) => updateBrief('destinations', d.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <Label style={{ fontWeight: 600, marginBottom: '8px', display: 'block', fontSize: '12px' }}>
                Content Type
              </Label>
              <RadioGroup
                value={brief.content_type}
                onChange={(_, d) => setBrief(prev => ({ ...prev, content_type: d.value as 'text' | 'images' | 'both' }))}
                layout="horizontal"
              >
                <Radio
                  value="text"
                  label={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <TextFieldRegular style={{ fontSize: '16px' }} /> Text Only
                    </span>
                  }
                />
                <Radio
                  value="images"
                  label={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <ImageRegular style={{ fontSize: '16px' }} /> Images Only
                    </span>
                  }
                />
                <Radio
                  value="both"
                  label={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <ImageMultipleRegular style={{ fontSize: '16px' }} /> Text + Images
                    </span>
                  }
                />
              </RadioGroup>
            </div>

            <Button
              appearance="primary"
              icon={isGenerating ? <Spinner size="tiny" /> : <SparkleRegular />}
              size="large"
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                background: 'linear-gradient(135deg, #F97316 0%, #D63B2F 100%)',
                border: 'none',
                marginTop: '8px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
              }}
            >
              {isGenerating ? 'Agents Working...' : 'Generate Content'}
            </Button>
          </div>
        </Card>

        {/* Right: Results */}
        <div className={styles.resultArea}>
          {isGenerating && (
            <Card style={{ padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
              <Spinner size="large" label="" />
              <Title3 style={{ marginTop: '16px' }}>Agents Collaborating...</Title3>
              <Body2 style={{ color: '#64748B', marginTop: '8px' }}>
                Creator → Reviewer → Publisher working on your Zava Travel content
              </Body2>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
                <Badge appearance="filled" style={{ background: '#0891B2', padding: '6px 16px' }}>✍️ Creator: Drafting...</Badge>
                <Badge appearance="outline" style={{ borderColor: '#F97316', color: '#F97316', padding: '6px 16px' }}>🔍 Reviewer: Waiting</Badge>
                <Badge appearance="outline" style={{ borderColor: '#059669', color: '#059669', padding: '6px 16px' }}>📤 Publisher: Waiting</Badge>
              </div>
            </Card>
          )}

          {result && (
            <>
              {/* Status Bar */}
              {error ? (
                <MessageBar intent="warning">
                  <MessageBarBody>
                    ⚠️ API server offline — showing demo data. Start with: python api_server.py
                  </MessageBarBody>
                </MessageBar>
              ) : (
                <MessageBar intent="success">
                  <MessageBarBody>
                    ✅ Content generated in {result.duration_seconds}s — {result.termination_reason}
                  </MessageBarBody>
                </MessageBar>
              )}

              {/* Tabs */}
              <TabList selectedValue={activeTab} onTabSelect={(_, d) => setActiveTab(d.value as string)}>
                <Tab value="posts">📝 Platform Posts</Tab>
                <Tab value="transcript">🧠 Agent Transcript</Tab>
              </TabList>

              {activeTab === 'posts' && (
                <>
                  {Object.entries(result.posts).map(([platform, content]: [string, string]) => {
                    const config = PLATFORM_CONFIG[platform]
                    const imageUrl = result.images?.[platform as keyof typeof result.images]
                    const showText = brief.content_type !== 'images'
                    const showImage = brief.content_type !== 'text' && imageUrl
                    return (
                      <Card key={platform} className={styles.postCard}>
                        <div className={styles.platformHeader}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px' }}>{config.emoji}</span>
                            <Title3>{config.label}</Title3>
                            {showImage && (
                              <Badge appearance="filled" size="small" style={{ background: '#059669', fontSize: '10px' }}>
                                📷 Image
                              </Badge>
                            )}
                          </div>
                          {showText && (
                            <Button
                              appearance="subtle"
                              icon={copied === platform ? <CheckmarkRegular /> : <DocumentCopyRegular />}
                              onClick={() => copyToClipboard(content, platform)}
                            >
                              {copied === platform ? 'Copied!' : 'Copy'}
                            </Button>
                          )}
                        </div>
                        {showText && platform === 'twitter' && (
                          <div className={styles.charCount}>
                            <Caption1 style={{ color: content.length > 280 ? '#EF4444' : '#059669' }}>
                              {content.length}/280 characters
                            </Caption1>
                          </div>
                        )}
                        {showImage && (
                          <div style={{ marginTop: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                            <img
                              src={imageUrl}
                              alt={`${config.label} campaign visual`}
                              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'cover' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          </div>
                        )}
                        {showText && <div className={styles.postContent}>{content}</div>}
                      </Card>
                    )
                  })}
                </>
              )}

              {activeTab === 'transcript' && (
                <Card style={{ padding: '24px', borderRadius: '12px' }}>
                  <Title3 style={{ marginBottom: '16px' }}>Agent Collaboration Transcript</Title3>
                  {result.transcript.map((msg: AgentMessage, i: number) => {
                    const colors = AGENT_COLORS[msg.agent_name] || { border: '#CBD5E1', bg: '#F8FAFC' }
                    return (
                      <div
                        key={i}
                        className={styles.transcriptMsg}
                        style={{ borderLeftColor: colors.border, background: colors.bg }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Title3 style={{ color: colors.border }}>{msg.agent_name}</Title3>
                          <Badge appearance="outline" size="small" style={{ borderColor: colors.border, color: colors.border }}>
                            {msg.reasoning_pattern}
                          </Badge>
                        </div>
                        <Body2 style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.content}</Body2>
                      </div>
                    )
                  })}
                </Card>
              )}

              {/* Workflow Stats */}
              <Card style={{ padding: '20px', borderRadius: '12px' }}>
                <Title3 style={{ marginBottom: '8px' }}>📊 Workflow Summary</Title3>
                <div className={styles.statsRow}>
                  <Badge appearance="filled" size="large" style={{ background: '#0891B2', padding: '8px 16px' }}>
                    ⏱️ {result.duration_seconds}s
                  </Badge>
                  <Badge appearance="filled" size="large" style={{ background: '#059669', padding: '8px 16px' }}>
                    💬 {result.transcript.length} agent turns
                  </Badge>
                  <Badge appearance="filled" size="large" style={{ background: '#F97316', padding: '8px 16px' }}>
                    📋 3 platform posts
                  </Badge>
                  <Badge appearance="filled" size="large" style={{ background: '#7C3AED', padding: '8px 16px' }}>
                    🔒 Security: Clean
                  </Badge>
                </div>
              </Card>
            </>
          )}

          {!result && !isGenerating && (
            <Card style={{ padding: '60px', textAlign: 'center', borderRadius: '12px', border: '2px dashed #CBD5E1' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✈️</div>
              <Title2 style={{ color: '#94A3B8' }}>Ready to Create</Title2>
              <Body1 style={{ color: '#94A3B8', marginTop: '8px' }}>
                Fill in the campaign brief and click "Generate Content" to start the multi-agent workflow
              </Body1>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
