import { UseCaseId, NudgeConfig, calculateEMI } from "./journeys";

interface Suggestion {
  creditLimit: number;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  transactionAmount: number;
  outstandingAmount: number;
  settlementPercentage: number;
  nudges: NudgeConfig;
}

const BANK_TIERS: Record<string, "premium" | "standard" | "value"> = {
  hdfc: "premium",
  icici: "premium",
  axis: "premium",
  kotak: "premium",
  idfcfirst: "premium",
  yesbank: "premium",
  indusind: "standard",
  sbi: "standard",
  pnb: "value",
  bob: "value",
  canara: "value",
  unionbank: "value",
};

const TIER_MULTIPLIERS = {
  premium: 1.3,
  standard: 1.0,
  value: 0.8,
};

export function getSuggestions(
  bankId: string,
  useCaseId: UseCaseId
): Suggestion {
  const tier = BANK_TIERS[bankId] ?? "standard";
  const mult = TIER_MULTIPLIERS[tier];

  const base: Suggestion = {
    creditLimit: Math.round(150000 * mult),
    loanAmount: Math.round(500000 * mult),
    interestRate: useCaseId === "personal-loan" ? (tier === "premium" ? 10.49 : tier === "standard" ? 12.99 : 14.99) : 3.49,
    tenure: useCaseId === "personal-loan" ? 36 : useCaseId === "emi-conversion" ? 12 : 6,
    emi: 0,
    transactionAmount: Math.round(45000 * mult),
    outstandingAmount: Math.round(28500 * mult),
    settlementPercentage: tier === "premium" ? 90 : tier === "standard" ? 85 : 80,
    nudges: defaultNudges(useCaseId, tier),
  };

  base.emi = calculateEMI(base.loanAmount, base.interestRate, base.tenure);

  return base;
}

function defaultNudges(
  useCaseId: UseCaseId,
  tier: "premium" | "standard" | "value"
): NudgeConfig {
  const socialProofBase = tier === "premium" ? 85000 : tier === "standard" ? 52000 : 38000;
  const savingsBase = tier === "premium" ? 18000 : tier === "standard" ? 12000 : 8000;

  const nudgeMap: Record<UseCaseId, NudgeConfig> = {
    "credit-card": {
      scarcityTimer: true,
      scarcityHours: 72,
      socialProof: true,
      socialProofCount: socialProofBase,
      preApprovedBadge: true,
      savingsMeter: true,
      savingsAmount: savingsBase,
    },
    "personal-loan": {
      scarcityTimer: true,
      scarcityHours: 48,
      socialProof: true,
      socialProofCount: socialProofBase,
      preApprovedBadge: true,
      savingsMeter: true,
      savingsAmount: savingsBase * 2,
    },
    "emi-conversion": {
      scarcityTimer: false,
      scarcityHours: 24,
      socialProof: true,
      socialProofCount: Math.round(socialProofBase * 0.7),
      preApprovedBadge: false,
      savingsMeter: true,
      savingsAmount: Math.round(savingsBase * 0.5),
    },
    collections: {
      scarcityTimer: true,
      scarcityHours: 24,
      socialProof: false,
      socialProofCount: 0,
      preApprovedBadge: false,
      savingsMeter: false,
      savingsAmount: 0,
    },
  };

  return nudgeMap[useCaseId];
}
