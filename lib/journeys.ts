export type UseCaseId =
  | "credit-card"
  | "personal-loan"
  | "emi-conversion"
  | "collections";

export interface UseCase {
  id: UseCaseId;
  name: string;
  description: string;
  icon: string;
  screens: ScreenId[];
  defaultConfig: Partial<PrototypeConfig>;
}

export type ScreenId =
  | "welcome"
  | "offer-details"
  | "emi-calculator"
  | "benefits"
  | "transaction-select"
  | "emi-plans"
  | "payment-summary"
  | "payment-options"
  | "settlement-offer"
  | "confirm"
  | "otp"
  | "set-pin"
  | "rejected"
  | "success";

export const USE_CASES: UseCase[] = [
  {
    id: "credit-card",
    name: "Credit Card Activation",
    description:
      "Activate a pre-approved credit card with benefits showcase and PIN setup",
    icon: "💳",
    screens: ["welcome", "offer-details", "benefits", "otp", "set-pin", "success"],
    defaultConfig: {
      headline: "Your Card is Ready to Activate!",
      subheadline: "Complete activation in under 2 minutes",
      ctaText: "Activate Now",
      successMessage: "Card Activated Successfully!",
      creditLimit: 150000,
      interestRate: 3.49,
    },
  },
  {
    id: "personal-loan",
    name: "Pre-Approved Personal Loan",
    description:
      "Present a personalised pre-approved loan offer with EMI calculator",
    icon: "💰",
    screens: ["welcome", "offer-details", "emi-calculator", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "You're Pre-Approved!",
      subheadline: "Exclusive offer available for a limited time",
      ctaText: "Claim Your Offer",
      successMessage: "Loan Approved & Disbursed!",
      loanAmount: 500000,
      interestRate: 10.99,
      tenure: 36,
    },
  },
  {
    id: "emi-conversion",
    name: "EMI Conversion",
    description:
      "Convert recent transactions into easy monthly instalments with zero hassle",
    icon: "📊",
    screens: ["welcome", "transaction-select", "emi-plans", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Convert to Easy EMIs",
      subheadline: "Split your purchase into manageable payments",
      ctaText: "Convert to EMI",
      successMessage: "EMI Set Up Successfully!",
      transactionAmount: 45000,
      interestRate: 13.99,
      tenure: 12,
    },
  },
  {
    id: "collections",
    name: "Collections & Debt Recovery",
    description:
      "Guide customers to resolve outstanding dues with settlement options",
    icon: "🔔",
    screens: ["welcome", "payment-summary", "payment-options", "otp", "success"],
    defaultConfig: {
      headline: "Clear Your Dues Today",
      subheadline: "Avoid late fees and protect your credit score",
      ctaText: "Pay Now",
      successMessage: "Payment Successful!",
      outstandingAmount: 28500,
      interestRate: 2.5,
    },
  },
];

export function getUseCaseById(id: UseCaseId): UseCase | undefined {
  return USE_CASES.find((u) => u.id === id);
}

export function getScreensForUseCase(
  useCase: UseCase,
  showRejection: boolean
): ScreenId[] {
  const screens = [...useCase.screens];
  if (showRejection) {
    const otpIndex = screens.indexOf("otp");
    if (otpIndex > 0) {
      screens.splice(otpIndex, 0, "rejected");
    }
  }
  return screens;
}

export interface NudgeConfig {
  scarcityTimer: boolean;
  scarcityHours: number;
  socialProof: boolean;
  socialProofCount: number;
  preApprovedBadge: boolean;
  savingsMeter: boolean;
  savingsAmount: number;
}

export interface CustomBankColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgLight: string;
}

export interface PrototypeConfig {
  customerName: string;
  creditLimit: number;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  transactionAmount: number;
  outstandingAmount: number;
  settlementPercentage: number;
  nudges: NudgeConfig;
  showRejectionFlow: boolean;
  headline: string;
  subheadline: string;
  ctaText: string;
  successMessage: string;
  customBankName?: string;
  customBankColors?: CustomBankColors;
}

export const DEFAULT_CONFIG: PrototypeConfig = {
  customerName: "Rahul",
  creditLimit: 150000,
  loanAmount: 500000,
  interestRate: 10.99,
  tenure: 36,
  emi: 16347,
  transactionAmount: 45000,
  outstandingAmount: 28500,
  settlementPercentage: 80,
  nudges: {
    scarcityTimer: true,
    scarcityHours: 48,
    socialProof: true,
    socialProofCount: 52000,
    preApprovedBadge: true,
    savingsMeter: true,
    savingsAmount: 12000,
  },
  showRejectionFlow: false,
  headline: "Your Exclusive Offer is Ready!",
  subheadline: "Activate in under 2 minutes",
  ctaText: "Get Started",
  successMessage: "All done! You're set.",
};

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (annualRate === 0) return Math.round(principal / tenureMonths);
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
