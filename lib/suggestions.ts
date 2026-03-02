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
  currentCreditLimit: number;
  newCreditLimit: number;
  fdAmount: number;
  fdRate: number;
  nudges: NudgeConfig;
}

const BANK_TIERS: Record<string, "premium" | "standard" | "value"> = {
  hdfc: "premium",
  axis: "premium",
  kotak: "premium",
  yesbank: "premium",
  indusind: "premium",
  dbs: "premium",
  sbicard: "standard",
  bobcard: "standard",
  federal: "standard",
  aubank: "standard",
  ltfinance: "value",
  smfg: "value",
  bajajfinance: "value",
};

const TIER_MULTIPLIERS = { premium: 1.3, standard: 1.0, value: 0.8 };

const CARD_USE_CASES = new Set<UseCaseId>([
  "credit-card", "transaction-to-emi", "outstanding-to-emi",
  "credit-limit-increase", "loan-on-card", "personal-loan-on-card",
  "addon-card", "card-upgrade", "card-activation-rbi", "pin-set",
  "card-controls", "spend-activation", "spend-increase",
  "dormancy-consent", "dormancy-reactivation", "emi-conversion",
]);

const LOAN_USE_CASES = new Set<UseCaseId>([
  "personal-loan", "loan-personal", "loan-topup",
]);

const COLLECTIONS_USE_CASES = new Set<UseCaseId>([
  "collections", "payment-journey", "settlement-offer",
]);

export function getSuggestions(bankId: string, useCaseId: UseCaseId): Partial<Suggestion> {
  const tier = BANK_TIERS[bankId] ?? "standard";
  const mult = TIER_MULTIPLIERS[tier];

  const isLoan = LOAN_USE_CASES.has(useCaseId);
  const isCollections = COLLECTIONS_USE_CASES.has(useCaseId);

  const loanAmt = Math.round(500000 * mult);
  const rate = isLoan
    ? (tier === "premium" ? 10.49 : tier === "standard" ? 12.99 : 14.99)
    : isCollections
    ? 2.5
    : (tier === "premium" ? 3.25 : tier === "standard" ? 3.49 : 3.75);
  const ten = useCaseId === "loan-topup" ? 24 : isLoan ? 36 : 12;

  return {
    creditLimit: Math.round(150000 * mult),
    currentCreditLimit: Math.round(100000 * mult),
    newCreditLimit: Math.round(200000 * mult),
    loanAmount: loanAmt,
    interestRate: rate,
    tenure: ten,
    emi: calculateEMI(loanAmt, rate, ten),
    transactionAmount: Math.round(45000 * mult),
    outstandingAmount: Math.round(28500 * mult),
    settlementPercentage: tier === "premium" ? 90 : tier === "standard" ? 85 : 80,
    fdAmount: Math.round(100000 * mult),
    fdRate: tier === "premium" ? 7.75 : tier === "standard" ? 7.5 : 7.25,
    nudges: defaultNudges(useCaseId, tier),
  };
}

function defaultNudges(
  useCaseId: UseCaseId,
  tier: "premium" | "standard" | "value"
): NudgeConfig {
  const socialBase = tier === "premium" ? 85000 : tier === "standard" ? 52000 : 38000;
  const savingsBase = tier === "premium" ? 18000 : tier === "standard" ? 12000 : 8000;

  if (COLLECTIONS_USE_CASES.has(useCaseId)) {
    return { scarcityTimer: true, scarcityHours: 24, socialProof: false, socialProofCount: 0, preApprovedBadge: false, savingsMeter: false, savingsAmount: 0 };
  }
  if (["pin-set", "card-controls", "dormancy-consent", "savings-account", "fd-opening"].includes(useCaseId)) {
    return { scarcityTimer: false, scarcityHours: 48, socialProof: false, socialProofCount: 0, preApprovedBadge: false, savingsMeter: false, savingsAmount: 0 };
  }
  return {
    scarcityTimer: true,
    scarcityHours: tier === "premium" ? 72 : 48,
    socialProof: true,
    socialProofCount: socialBase,
    preApprovedBadge: true,
    savingsMeter: true,
    savingsAmount: savingsBase,
  };
}
