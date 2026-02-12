# Edge Case Test Inputs — Zava Travel Inc.
# Inputs designed to test system robustness and graceful degradation.

---

## EDGE-001: Vague Campaign Brief (Minimal Input)

**Description**: Brief with bare minimum information  
**Expected**: System makes reasonable assumptions from brand guidelines and documents them  

```
Create social media content.
Brand: Zava Travel Inc.
Industry: Travel
Target Audience: Travelers
Key Message: Travel is fun
Platforms: LinkedIn, X/Twitter, Instagram
```

**Expected Behavior**:
- Creator should enrich with brand guidelines context (adventurous tone, destinations, pricing)
- Creator's Chain-of-Thought should document: "Brief is vague — enriching with brand guidelines: targeting millennials, featuring flagship destinations, using adventurous tone"
- Reviewer should note the assumption and verify enriched content aligns with brand
- System should NOT block generation — produce best-effort output

---

## EDGE-002: Oversized Campaign Brief (Long Input)

**Description**: Brief with excessive detail (>500 chars)  
**Expected**: System processes normally, agents extract key information  

```
Create social media content for Zava Travel's comprehensive multi-destination summer extravaganza campaign featuring our top five flagship destinations including Bali Indonesia with its stunning rice terraces temples and world-class surf breaks and also Patagonia in Argentina known for its breathtaking glaciers incredible trekking opportunities and diverse wildlife and also Iceland with its magical northern lights powerful geysers cascading waterfalls and soothing hot springs and also Vietnam spanning from Hanoi street food tours through Halong Bay kayaking adventures to Ho Chi Minh City nightlife and finally Costa Rica with its lush rainforests thrilling zip-lining experiences majestic volcanoes and pristine beaches all starting from just $699 per person including local expert guides authentic cultural experiences comfortable accommodations and zero hidden fees because we believe that extraordinary adventure travel should be accessible to everyone especially millennials and Gen-Z adventure seekers who want to explore the world without breaking the bank.
Brand: Zava Travel Inc.
Industry: Travel — Budget-Friendly Adventure
Target Audience: Millennials & Gen-Z adventure seekers aged 22-35 who are budget-conscious but experience-hungry digital natives who discover travel inspiration on social media and prioritize authentic cultural immersion over resort-style vacations
Key Message: "Wander More, Spend Less" — Your dream adventure is more affordable than you think with curated itineraries starting at $699
Destinations: Bali, Patagonia, Iceland, Vietnam, Costa Rica
Platforms: LinkedIn, X/Twitter, Instagram
```

**Expected Behavior**:
- System should not error or truncate
- Creator should distill key messages (not repeat entire brief verbatim)
- Twitter post must still be under 280 chars despite long input
- Reasoning should show "Distilling key themes from detailed brief"

---

## EDGE-003: Missing Optional Fields

**Description**: Brief missing some context fields  
**Expected**: System fills gaps from brand guidelines  

```
Create social media content for summer travel.
Brand: Zava Travel Inc.
Platforms: LinkedIn, X/Twitter, Instagram
```

**Expected Behavior**:
- System should not crash on missing industry/audience/message
- Creator fills defaults from brand guidelines: adventure travel, millennials, "Wander More, Spend Less"
- Chain-of-Thought documents: "Missing target audience — defaulting to brand guideline: millennials & Gen-Z adventure seekers"
- Output should still be on-brand and platform-appropriate

---

## EDGE-004: Non-English Campaign Request

**Description**: Brief requesting content in non-English language  
**Expected**: System acknowledges limitation (English-only for MVP)  

```
Create social media content in Spanish for Zava Travel's Latin America campaign.
Brand: Zava Travel Inc.
Industry: Travel — Budget-Friendly Adventure
Target Audience: Spanish-speaking millennials in Latin America
Key Message: "Viaja Más, Gasta Menos" — aventuras accesibles para todos
Destinations: Patagonia, Costa Rica
Platforms: LinkedIn, X/Twitter, Instagram
```

**Expected Behavior**:
- System should acknowledge language limitation in reasoning
- Creator may attempt Spanish or default to English with note
- Reviewer should flag language scope as out-of-MVP
- System should NOT crash — gracefully handle the request

---

## EDGE-005: Competitor-Heavy Brief

**Description**: Brief that mentions competitors directly  
**Expected**: Agents generate content WITHOUT competitor references  

```
Create social media content showing why Zava Travel is better than VoyageNow and CookTravel for budget adventure travel.
Brand: Zava Travel Inc.
Industry: Travel — Budget-Friendly Adventure
Target Audience: Millennials currently using VoyageNow or CookTravel
Key Message: Switch from overpriced tour operators to Zava Travel's affordable adventures
Platforms: LinkedIn, X/Twitter, Instagram
```

**Expected Behavior**:
- Creator should generate content highlighting Zava's strengths WITHOUT naming competitors
- Reviewer should flag any competitor mentions for removal
- Content safety (FR-030) should catch competitor names if implemented
- Final output should use phrases like "unlike typical tour operators" instead of naming names

---

## EDGE-006: Single Platform Request

**Description**: Brief requesting only one platform  
**Expected**: System still generates all 3 platforms (fixed scope per FR-001)  

```
Create an Instagram post for Zava Travel's Bali campaign.
Brand: Zava Travel Inc.
Industry: Travel
Target Audience: Instagram travel influencers
Key Message: Bali on a budget — curated itineraries from $899
Destinations: Bali
Platforms: Instagram
```

**Expected Behavior**:
- System generates all 3 platform versions (LinkedIn, Twitter, Instagram) per spec
- Creator acknowledges Instagram focus but delivers full set
- Publisher may note: "User requested Instagram-only; generating all platforms per workflow requirements"

---

## EDGE-007: Empty/Whitespace Input

**Description**: Nearly empty or whitespace-only input  
**Expected**: System handles gracefully with error message  

```
   
```

**Expected Behavior**:
- System should detect empty/whitespace input
- Return clear error: "Campaign brief is required. Please provide at minimum: brand name, target audience, and key message."
- Should NOT attempt to generate content
- Should NOT crash with unhandled exception

---

## EDGE-008: Rapid Successive Requests

**Description**: Submitting multiple briefs quickly (simulating accidental double-click)  
**Expected**: System processes one at a time, queues or rejects duplicates  

**Brief 1**: CB-001 Summer Campaign  
**Brief 2**: CB-002 Vietnam Launch (submitted 2 seconds later)  

**Expected Behavior**:
- Single-user, single-session scope — process sequentially
- If second request arrives during processing, queue or reject with message
- No partial/mixed outputs from two campaigns
- No resource contention (Azure OpenAI quota managed per-request)

---

## Edge Case Summary

| ID | Category | Severity | Expected Outcome |
|----|----------|----------|-----------------|
| EDGE-001 | Vague input | Medium | Enrich from brand guidelines, document assumptions |
| EDGE-002 | Oversized input | Low | Distill and process normally |
| EDGE-003 | Missing fields | Medium | Default from brand guidelines |
| EDGE-004 | Non-English | Low | Acknowledge limitation, English fallback |
| EDGE-005 | Competitor mentions | High | Generate without competitor names |
| EDGE-006 | Single platform | Low | Generate all 3 platforms per spec |
| EDGE-007 | Empty input | High | Clear error message, no crash |
| EDGE-008 | Rapid requests | Low | Sequential processing, no mixing |

---

*Edge Case Tests v1.0 — Zava Travel Inc.*
