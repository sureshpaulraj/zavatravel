const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface CampaignBrief {
  brand_name: string
  industry: string
  target_audience: string
  key_message: string
  destinations: string
  platforms: string[]
  content_type: 'text' | 'images' | 'both'
}

export interface AgentMessage {
  agent_name: string
  content: string
  reasoning_pattern: string
  timestamp: string
}

export interface GeneratedPosts {
  linkedin: string
  twitter: string
  instagram: string
}

export interface GeneratedImages {
  linkedin?: string
  twitter?: string
  instagram?: string
}

export interface WorkflowResult {
  status: 'success' | 'error'
  posts: GeneratedPosts
  images?: GeneratedImages
  transcript: AgentMessage[]
  duration_seconds: number
  termination_reason: string
}

export async function generateContent(brief: CampaignBrief): Promise<WorkflowResult> {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brief),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/health`)
    return res.ok
  } catch {
    return false
  }
}

// Mock data for demo when backend is unavailable
export function getMockResult(): WorkflowResult {
  return {
    status: 'success',
    posts: {
      linkedin: `🌍 **The adventure of a lifetime doesn't have to cost a lifetime of savings.**\n\nAt Zava Travel, we believe extraordinary experiences and smart budgets aren't mutually exclusive. Our 2026 summer itineraries are live — from sunrise treks through Bali's emerald rice terraces to glacier hikes across Patagonia's untouched wilderness.\n\nEvery Zava itinerary is expert-curated, locally guided, and refreshingly affordable. Starting at just $699.\n\n👉 Explore summer itineraries: zavatravel.com\n\n#ZavaTravel #WanderMore #AdventureAwaits #BudgetTravel #SummerAdventure2026`,
      twitter: `Your dream adventure starts at $699 🌍 Bali rice terraces. Patagonia glaciers. Iceland hot springs. Real itineraries, real prices. Wander More, Spend Less → zavatravel.com #ZavaTravel #WanderMore`,
      instagram: `✈️🌅 Close your eyes. Imagine standing at the edge of a glacier in Patagonia, wind in your hair, knowing you didn't break the bank to get there.\n\nThat's Zava Travel — turning "someday" into "this summer." 🏔️🌊\n\nOur curated adventures start at $699:\n🇮🇩 Bali — sunrise rice terrace treks\n🇦🇷 Patagonia — glacier hikes & wildlife\n🇮🇸 Iceland — hot springs & waterfalls\n🇻🇳 Vietnam — street food & motorbike routes\n🇨🇷 Costa Rica — zip-lining & volcano hikes\n\nWhich adventure are you choosing? Drop a 🌍 below!\n\n👉 Link in bio → zavatravel.com\n\n#ZavaTravel #WanderMore #AdventureAwaits #TravelOnABudget #ExploreMore #BudgetTravel #SummerAdventure2026 #ZavaBali #ZavaPatagonia #TravelInspiration`,
    },
    images: {
      linkedin: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=400&fit=crop',
      twitter: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=400&fit=crop',
      instagram: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
    },
    transcript: [
      { agent_name: 'Creator', content: '**Step 1: Identify Objective**\nThe campaign aims to promote Zava Travel\'s summer adventure itineraries with the "Wander More, Spend Less" theme.\n\n**Step 2: Consider Audience**\nMillennials & Gen-Z adventure seekers who value authentic, budget-friendly experiences.\n\n**Step 3: Draft Hook**\n"The adventure of a lifetime doesn\'t have to cost a lifetime of savings."\n\n**Step 4: Build Body**\nHighlight flagship destinations and $699 starting price.\n\n**Step 5: Add CTA**\nDirect to zavatravel.com for itinerary exploration.', reasoning_pattern: 'Chain-of-Thought', timestamp: new Date().toISOString() },
      { agent_name: 'Reviewer', content: '**Observation**: The draft effectively captures Zava Travel\'s adventurous and inspiring tone with strong destination imagery.\n\n**Thought**: The hook is compelling and the CTA is clear. Pricing is mentioned which adds credibility.\n\n**Action**: Minor improvement — add more sensory language for Instagram adaptation.\n\n**Result**: Content is strong and brand-aligned.\n\n**VERDICT**: APPROVED ✅', reasoning_pattern: 'ReAct', timestamp: new Date().toISOString() },
      { agent_name: 'Publisher', content: '**Self-Reflection Checks:**\n✅ LinkedIn: Professional-adventurous tone, 3 paragraphs, 5 hashtags including #ZavaTravel\n✅ Twitter: 198 characters (under 280 limit), 2 hashtags, CTA with link\n✅ Instagram: Travel emojis, storytelling tone, 9 hashtags, engagement prompt\n✅ All posts include zavatravel.com CTA\n✅ No competitor mentions\n✅ Brand voice consistent across platforms', reasoning_pattern: 'Self-Reflection', timestamp: new Date().toISOString() },
    ],
    duration_seconds: 42.5,
    termination_reason: 'Reviewer approved — fast-tracked to Publisher',
  }
}
