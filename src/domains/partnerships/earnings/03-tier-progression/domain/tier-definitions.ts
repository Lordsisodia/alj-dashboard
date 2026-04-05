export type PartnerTierId = "bronze" | "silver" | "gold" | "platinum"

export type TierDefinition = {
  id: PartnerTierId
  title: string
  commissionRate: number
  color: string
  description: string
  requirements: {
    commissionsUSD: number
    referrals: number
    training: string
    monthsActive: number
    extra?: string
  }
  benefits: string[]
}

export const tierDefinitions: TierDefinition[] = [
  {
    id: "bronze",
    title: "Bronze",
    commissionRate: 0.2,
    color: "#cd7f32",
    description: "Kick-off tier for new partners",
    requirements: {
      commissionsUSD: 0,
      referrals: 0,
      training: "Onboarding",
      monthsActive: 0,
    },
    benefits: ["20% base commission", "Campus + Pipeline access"],
  },
  {
    id: "silver",
    title: "Silver",
    commissionRate: 0.25,
    color: "#c0c0c0",
    description: "Reliable operator with proven output",
    requirements: {
      commissionsUSD: 5000,
      referrals: 10,
      training: "Core modules",
      monthsActive: 3,
    },
    benefits: ["25% commission", "Mentor office hours", "Affiliate dashboard access"],
  },
  {
    id: "gold",
    title: "Gold",
    commissionRate: 0.3,
    color: "#f6b75e",
    description: "Consistent closer and pipeline leader",
    requirements: {
      commissionsUSD: 15000,
      referrals: 25,
      training: "Advanced certification",
      monthsActive: 6,
      extra: "Lead quality score >70%",
    },
    benefits: ["30% commission", "Priority support", "Campaign co-marketing"],
  },
  {
    id: "platinum",
    title: "Platinum",
    commissionRate: 0.35,
    color: "#e5e4e2",
    description: "Strategic partner and pod leader",
    requirements: {
      commissionsUSD: 50000,
      referrals: 50,
      training: "All modules + specialist",
      monthsActive: 12,
      extra: "Consistent performance",
    },
    benefits: ["35% commission", "Dedicated success manager", "Early product access"],
  },
]
