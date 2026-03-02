// ─── Auth types ──────────────────────────────────────────────────────────────

export type AuthFieldType = "text" | "tel" | "number" | "password" | "date" | "otp";
export type MaskRule = "none" | "partial" | "full";

export interface AuthField {
  id: string;
  label: string;
  type: AuthFieldType;
  mask: MaskRule;
  required: boolean;
  placeholder?: string;
  hint?: string;
}

export const DEFAULT_CARD_AUTH_FIELDS: AuthField[] = [
  { id: "mobile", label: "Mobile Number", type: "tel", mask: "partial", required: true, placeholder: "98XXXXXX12", hint: "Registered mobile number" },
  { id: "card-last4", label: "Card Last 4 Digits", type: "number", mask: "none", required: true, placeholder: "XXXX", hint: "Last 4 digits on front of card" },
  { id: "otp", label: "OTP", type: "otp", mask: "none", required: true, hint: "6-digit code sent to your mobile" },
];

export const DEFAULT_LOAN_AUTH_FIELDS: AuthField[] = [
  { id: "mobile", label: "Mobile Number", type: "tel", mask: "partial", required: true, placeholder: "98XXXXXX12", hint: "Registered mobile number" },
  { id: "dob-year", label: "Year of Birth", type: "number", mask: "none", required: true, placeholder: "YYYY", hint: "4-digit year for identity verification" },
  { id: "otp", label: "OTP", type: "otp", mask: "none", required: true, hint: "6-digit code sent to your mobile" },
];

// ─── Use-case categories ─────────────────────────────────────────────────────

export type UseCaseCategory = "cards" | "loans" | "liabilities" | "collections" | "other";

// ─── Screen IDs ───────────────────────────────────────────────────────────────

export type ScreenId =
  // Shared / navigation
  | "campaign-preview"
  | "welcome"
  | "auth"
  | "offer-details"
  | "benefits"
  | "confirm"
  | "otp"
  | "set-pin"
  | "rejected"
  | "success"
  // Cards — legacy
  | "emi-calculator"
  | "transaction-select"
  | "emi-plans"
  | "payment-summary"
  | "payment-options"
  | "settlement-offer"    // legacy screen id
  // Cards — new
  | "outstanding-emi"
  | "cli-offer"
  | "loc-offer"
  | "ploc-offer"
  | "addon-card"
  | "card-upgrade"
  | "card-intent"
  | "card-controls"
  | "spend-activation"
  | "spend-increase"
  | "dormancy-consent"
  | "dormancy-reactivation"
  // Loans — new
  | "topup-offer"
  // Liabilities
  | "savings-screen"
  | "fd-offer"
  // Collections — new
  | "settlement-screen"
  // Other
  | "other-use-case";

// ─── Use-case IDs ─────────────────────────────────────────────────────────────

export type UseCaseId =
  // ── Legacy (kept for backward compatibility with existing saved prototypes) ──
  | "credit-card"
  | "personal-loan"
  | "emi-conversion"
  | "collections"
  // ── Cards ──
  | "transaction-to-emi"
  | "outstanding-to-emi"
  | "credit-limit-increase"
  | "loan-on-card"
  | "personal-loan-on-card"
  | "addon-card"
  | "card-upgrade"
  | "card-activation-rbi"
  | "pin-set"
  | "card-controls"
  | "spend-activation"
  | "spend-increase"
  | "dormancy-consent"
  | "dormancy-reactivation"
  // ── Loans ──
  | "loan-personal"
  | "loan-topup"
  // ── Liabilities ──
  | "savings-account"
  | "fd-opening"
  // ── Collections ──
  | "payment-journey"
  | "settlement-offer"
  // ── Other ──
  | "other";

// ─── UseCase definition ───────────────────────────────────────────────────────

export interface UseCase {
  id: UseCaseId;
  category: UseCaseCategory;
  name: string;
  description: string;
  icon: string;
  screens: ScreenId[];
  defaultConfig: Partial<PrototypeConfig>;
  legacy?: boolean;   // hides from the new categorised picker
}

// ─── Nudge config ─────────────────────────────────────────────────────────────

export interface NudgeConfig {
  scarcityTimer: boolean;
  scarcityHours: number;
  socialProof: boolean;
  socialProofCount: number;
  preApprovedBadge: boolean;
  savingsMeter: boolean;
  savingsAmount: number;
}

// ─── Custom bank colours (re-exported from here for convenience) ──────────────

export interface CustomBankColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgLight: string;
}

// ─── Prototype config ─────────────────────────────────────────────────────────

export interface PrototypeConfig {
  // --- customer personalisation ---
  customerName: string;

  // --- legacy card ---
  creditLimit: number;
  interestRate: number;

  // --- legacy loan ---
  loanAmount: number;
  tenure: number;
  emi: number;

  // --- legacy collections ---
  outstandingAmount: number;
  settlementPercentage: number;

  // --- legacy EMI conversion ---
  transactionAmount: number;

  // --- nudges & flows ---
  nudges: NudgeConfig;
  showRejectionFlow: boolean;

  // --- copy ---
  headline: string;
  subheadline: string;
  ctaText: string;
  successMessage: string;

  // --- custom bank ---
  customBankName?: string;
  customBankColors?: CustomBankColors;

  // ── Journey ──────────────────────────────────────────────────────────────
  journeyType?: "organic" | "campaign";
  campaignChannel?: "sms" | "whatsapp" | "email" | "rcs";

  // ── Authentication ────────────────────────────────────────────────────────
  authType?: "default" | "custom";
  authFields?: AuthField[];

  // ── Use-case meta ─────────────────────────────────────────────────────────
  useCaseCategory?: UseCaseCategory;
  otherUseCaseDescription?: string;
  otherUseCaseMode?: "generic" | "pick";
  otherUseCaseScreens?: ScreenId[];

  // ── Card use-case specific ────────────────────────────────────────────────
  currentCreditLimit?: number;
  newCreditLimit?: number;
  currentSpendLimit?: number;
  newSpendLimit?: number;
  cardTier?: string;
  upgradeCardTier?: string;
  addOnCardholderName?: string;
  dormancyDays?: number;
  cardControls?: {
    onlineTxn: boolean;
    internationalTxn: boolean;
    contactless: boolean;
    atmWithdrawal: boolean;
    ecommerce: boolean;
  };

  // ── Loan use-case specific ────────────────────────────────────────────────
  existingLoanAmount?: number;
  topUpAmount?: number;
  remainingTenure?: number;

  // ── Liability use-case specific ───────────────────────────────────────────
  fdAmount?: number;
  fdTenor?: number;
  fdRate?: number;
  fdInterestPayout?: "cumulative" | "monthly" | "quarterly";
  accountType?: "savings" | "salary" | "current";
  minimumBalance?: number;
}

// ─── Default nudges helper ────────────────────────────────────────────────────

const STANDARD_NUDGES: NudgeConfig = {
  scarcityTimer: true,
  scarcityHours: 48,
  socialProof: true,
  socialProofCount: 52000,
  preApprovedBadge: true,
  savingsMeter: true,
  savingsAmount: 12000,
};

const COLLECTIONS_NUDGES: NudgeConfig = {
  scarcityTimer: true,
  scarcityHours: 24,
  socialProof: false,
  socialProofCount: 0,
  preApprovedBadge: false,
  savingsMeter: false,
  savingsAmount: 0,
};

// ─── All use cases ─────────────────────────────────────────────────────────────

export const USE_CASES: UseCase[] = [
  // ── Legacy (backward compat) ────────────────────────────────────────────────
  {
    id: "credit-card",
    category: "cards",
    name: "Credit Card Activation (Legacy)",
    description: "Activate a pre-approved credit card with benefits showcase and PIN setup",
    icon: "💳",
    legacy: true,
    screens: ["welcome", "offer-details", "benefits", "otp", "set-pin", "success"],
    defaultConfig: {
      headline: "Your Card is Ready to Activate!",
      subheadline: "Complete activation in under 2 minutes",
      ctaText: "Activate Now",
      successMessage: "Card Activated Successfully!",
      creditLimit: 150000,
      interestRate: 3.49,
      nudges: STANDARD_NUDGES,
    },
  },
  {
    id: "personal-loan",
    category: "loans",
    name: "Personal Loan (Legacy)",
    description: "Present a personalised pre-approved loan offer with EMI calculator",
    icon: "💰",
    legacy: true,
    screens: ["welcome", "offer-details", "emi-calculator", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "You're Pre-Approved!",
      subheadline: "Exclusive offer available for a limited time",
      ctaText: "Claim Your Offer",
      successMessage: "Loan Approved & Disbursed!",
      loanAmount: 500000,
      interestRate: 10.99,
      tenure: 36,
      nudges: STANDARD_NUDGES,
    },
  },
  {
    id: "emi-conversion",
    category: "cards",
    name: "EMI Conversion (Legacy)",
    description: "Convert recent transactions into easy monthly instalments",
    icon: "📊",
    legacy: true,
    screens: ["welcome", "transaction-select", "emi-plans", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Convert to Easy EMIs",
      subheadline: "Split your purchase into manageable payments",
      ctaText: "Convert to EMI",
      successMessage: "EMI Set Up Successfully!",
      transactionAmount: 45000,
      interestRate: 13.99,
      tenure: 12,
      nudges: STANDARD_NUDGES,
    },
  },
  {
    id: "collections",
    category: "collections",
    name: "Collections & Debt Recovery (Legacy)",
    description: "Guide customers to resolve outstanding dues with settlement options",
    icon: "🔔",
    legacy: true,
    screens: ["welcome", "payment-summary", "payment-options", "otp", "success"],
    defaultConfig: {
      headline: "Clear Your Dues Today",
      subheadline: "Avoid late fees and protect your credit score",
      ctaText: "Pay Now",
      successMessage: "Payment Successful!",
      outstandingAmount: 28500,
      interestRate: 2.5,
      nudges: COLLECTIONS_NUDGES,
    },
  },

  // ── Cards ────────────────────────────────────────────────────────────────────
  {
    id: "transaction-to-emi",
    category: "cards",
    name: "Transaction to EMI",
    description: "Convert eligible card transactions into flexible EMI plans",
    icon: "🔄",
    screens: ["welcome", "auth", "transaction-select", "emi-plans", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Convert Your Purchase to EMI",
      subheadline: "No foreclosure charges · Instant setup",
      ctaText: "View EMI Plans",
      successMessage: "EMI Activated Successfully!",
      transactionAmount: 45000,
      interestRate: 13.99,
      tenure: 12,
      nudges: { ...STANDARD_NUDGES, scarcityTimer: false, preApprovedBadge: false },
      useCaseCategory: "cards",
    },
  },
  {
    id: "outstanding-to-emi",
    category: "cards",
    name: "Outstanding to EMI",
    description: "Convert total card outstanding balance into manageable EMIs",
    icon: "📉",
    screens: ["welcome", "auth", "outstanding-emi", "emi-plans", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Pay Off Your Balance with Ease",
      subheadline: "Convert outstanding to EMI — no stress",
      ctaText: "Convert Balance",
      successMessage: "Balance Converted to EMI!",
      outstandingAmount: 62000,
      interestRate: 14.99,
      tenure: 12,
      nudges: { ...COLLECTIONS_NUDGES, scarcityTimer: true, scarcityHours: 48 },
      useCaseCategory: "cards",
    },
  },
  {
    id: "credit-limit-increase",
    category: "cards",
    name: "Credit Limit Increase",
    description: "Offer an upgraded credit limit to eligible cardholders",
    icon: "📈",
    screens: ["welcome", "auth", "cli-offer", "benefits", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "You're Eligible for a Higher Limit!",
      subheadline: "Upgrade your spending power today",
      ctaText: "Increase My Limit",
      successMessage: "Credit Limit Upgraded!",
      currentCreditLimit: 100000,
      newCreditLimit: 200000,
      nudges: STANDARD_NUDGES,
      useCaseCategory: "cards",
    },
  },
  {
    id: "loan-on-card",
    category: "cards",
    name: "Loan on Credit Card",
    description: "Instant loan against available credit card limit with flexible EMIs",
    icon: "💳",
    screens: ["welcome", "auth", "loc-offer", "emi-calculator", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Instant Loan on Your Card!",
      subheadline: "Disbursed in minutes · No new account needed",
      ctaText: "Get Loan Now",
      successMessage: "Loan Disbursed Successfully!",
      loanAmount: 200000,
      interestRate: 12.99,
      tenure: 24,
      nudges: STANDARD_NUDGES,
      useCaseCategory: "cards",
    },
  },
  {
    id: "personal-loan-on-card",
    category: "cards",
    name: "Personal Loan on Credit Card",
    description: "Pre-approved personal loan offered to existing cardholders",
    icon: "🏦",
    screens: ["welcome", "auth", "ploc-offer", "emi-calculator", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Exclusive Loan Offer Just for You!",
      subheadline: "No documents · Instant disbursal",
      ctaText: "Claim Loan Offer",
      successMessage: "Loan Approved & Disbursed!",
      loanAmount: 300000,
      interestRate: 11.49,
      tenure: 36,
      nudges: STANDARD_NUDGES,
      useCaseCategory: "cards",
    },
  },
  {
    id: "addon-card",
    category: "cards",
    name: "Add-on Credit Card",
    description: "Invite a family member to share the card benefits",
    icon: "👨‍👩‍👧",
    screens: ["welcome", "auth", "addon-card", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Share Your Card Benefits!",
      subheadline: "Add a family member · Lifetime Free",
      ctaText: "Add Family Card",
      successMessage: "Add-on Card Issued!",
      addOnCardholderName: "Priya",
      nudges: { ...STANDARD_NUDGES, scarcityTimer: false, savingsMeter: false },
      useCaseCategory: "cards",
    },
  },
  {
    id: "card-upgrade",
    category: "cards",
    name: "Card Upgrade",
    description: "Offer eligible customers an upgrade to a premium card variant",
    icon: "⬆️",
    screens: ["welcome", "auth", "card-upgrade", "benefits", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "You Qualify for a Premium Upgrade!",
      subheadline: "More rewards · More privileges",
      ctaText: "Upgrade My Card",
      successMessage: "Card Upgraded Successfully!",
      cardTier: "Gold",
      upgradeCardTier: "Platinum",
      nudges: STANDARD_NUDGES,
      useCaseCategory: "cards",
    },
  },
  {
    id: "card-activation-rbi",
    category: "cards",
    name: "Credit Card Activation (RBI 37-Day)",
    description: "RBI-mandated card intent activation within the 37-day window",
    icon: "✅",
    screens: ["welcome", "auth", "offer-details", "card-intent", "benefits", "confirm", "set-pin", "success"],
    defaultConfig: {
      headline: "Activate Your Card Today!",
      subheadline: "Complete activation to unlock full benefits",
      ctaText: "Activate Now",
      successMessage: "Card Activated — Welcome Aboard!",
      creditLimit: 150000,
      interestRate: 3.49,
      nudges: STANDARD_NUDGES,
      useCaseCategory: "cards",
    },
  },
  {
    id: "pin-set",
    category: "cards",
    name: "PIN Set",
    description: "Guided PIN setup flow for new or reset card",
    icon: "🔐",
    screens: ["welcome", "auth", "set-pin", "success"],
    defaultConfig: {
      headline: "Set Your Card PIN",
      subheadline: "Quick & secure — takes under a minute",
      ctaText: "Set PIN",
      successMessage: "PIN Set Successfully!",
      nudges: { ...STANDARD_NUDGES, scarcityTimer: false, socialProof: false, savingsMeter: false, preApprovedBadge: false },
      useCaseCategory: "cards",
    },
  },
  {
    id: "card-controls",
    category: "cards",
    name: "Card Control",
    description: "Let customers manage card controls — online, international, contactless, ATM",
    icon: "🎛️",
    screens: ["welcome", "auth", "card-controls", "success"],
    defaultConfig: {
      headline: "Your Card, Your Rules",
      subheadline: "Toggle controls instantly · Takes effect in real-time",
      ctaText: "Manage Controls",
      successMessage: "Controls Updated!",
      cardControls: { onlineTxn: true, internationalTxn: false, contactless: true, atmWithdrawal: true, ecommerce: true },
      nudges: { ...STANDARD_NUDGES, scarcityTimer: false, socialProof: false, savingsMeter: false, preApprovedBadge: false },
      useCaseCategory: "cards",
    },
  },
  {
    id: "spend-activation",
    category: "cards",
    name: "Credit Card Spend Activation",
    description: "Early spend activation campaign within the first 30 days of card issuance",
    icon: "⚡",
    screens: ["welcome", "auth", "spend-activation", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Make Your First Spend Today!",
      subheadline: "Earn ₹500 cashback on your first transaction",
      ctaText: "Activate & Spend",
      successMessage: "Spend Activated — Cashback on its Way!",
      currentSpendLimit: 150000,
      nudges: { ...STANDARD_NUDGES, preApprovedBadge: false },
      useCaseCategory: "cards",
    },
  },
  {
    id: "spend-increase",
    category: "cards",
    name: "Spend Increase",
    description: "Nudge customers to increase their monthly spending with targeted offers",
    icon: "📊",
    screens: ["welcome", "auth", "spend-increase", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Boost Your Rewards Potential!",
      subheadline: "Spend more · Earn more this month",
      ctaText: "Unlock Higher Limit",
      successMessage: "Spend Limit Increased!",
      currentSpendLimit: 50000,
      newSpendLimit: 100000,
      nudges: STANDARD_NUDGES,
      useCaseCategory: "cards",
    },
  },
  {
    id: "dormancy-consent",
    category: "cards",
    name: "365-Day Dormancy Consent",
    description: "Collect consent from cardholders to keep dormant cards active",
    icon: "😴",
    screens: ["welcome", "auth", "dormancy-consent", "success"],
    defaultConfig: {
      headline: "Keep Your Card Active!",
      subheadline: "A quick consent to avoid automatic closure",
      ctaText: "Keep My Card Active",
      successMessage: "Card Kept Active — Thank You!",
      dormancyDays: 365,
      nudges: { ...STANDARD_NUDGES, scarcityTimer: true, scarcityHours: 24, socialProof: false, preApprovedBadge: false, savingsMeter: false },
      useCaseCategory: "cards",
    },
  },
  {
    id: "dormancy-reactivation",
    category: "cards",
    name: "Card Dormancy Management",
    description: "Reactivate dormant cards with a targeted win-back offer",
    icon: "🔄",
    screens: ["welcome", "auth", "dormancy-reactivation", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Your Card Misses You!",
      subheadline: "Reactivate now and get exclusive rewards",
      ctaText: "Reactivate Card",
      successMessage: "Card Reactivated!",
      dormancyDays: 180,
      nudges: { ...STANDARD_NUDGES, scarcityTimer: true, scarcityHours: 48 },
      useCaseCategory: "cards",
    },
  },

  // ── Loans ─────────────────────────────────────────────────────────────────────
  {
    id: "loan-personal",
    category: "loans",
    name: "Personal Loan",
    description: "Present a personalised pre-approved personal loan with EMI calculator",
    icon: "💰",
    screens: ["welcome", "auth", "offer-details", "emi-calculator", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "You're Pre-Approved for ₹5L!",
      subheadline: "Lowest rates · Instant disbursal · No paperwork",
      ctaText: "Claim Your Loan",
      successMessage: "Loan Approved & Disbursed!",
      loanAmount: 500000,
      interestRate: 10.99,
      tenure: 36,
      nudges: STANDARD_NUDGES,
      useCaseCategory: "loans",
    },
  },
  {
    id: "loan-topup",
    category: "loans",
    name: "Top-up Loan",
    description: "Offer an additional loan top-up to existing borrowers",
    icon: "🔝",
    screens: ["welcome", "auth", "topup-offer", "emi-calculator", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Top Up Your Loan Today!",
      subheadline: "Pre-approved top-up available for your account",
      ctaText: "Get Top-Up Loan",
      successMessage: "Top-Up Disbursed!",
      existingLoanAmount: 300000,
      topUpAmount: 200000,
      interestRate: 11.49,
      tenure: 24,
      remainingTenure: 18,
      nudges: STANDARD_NUDGES,
      useCaseCategory: "loans",
    },
  },

  // ── Liabilities ───────────────────────────────────────────────────────────────
  {
    id: "savings-account",
    category: "liabilities",
    name: "Savings Account Opening",
    description: "Digital savings account opening with zero balance or premium variant",
    icon: "🏦",
    screens: ["welcome", "auth", "savings-screen", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Open Your Savings Account in Minutes!",
      subheadline: "7% interest · Zero balance · Fully digital",
      ctaText: "Open Account",
      successMessage: "Account Opened Successfully!",
      accountType: "savings",
      minimumBalance: 0,
      interestRate: 7.0,
      nudges: { ...STANDARD_NUDGES, scarcityTimer: false },
      useCaseCategory: "liabilities",
    },
  },
  {
    id: "fd-opening",
    category: "liabilities",
    name: "FD Opening",
    description: "Fixed deposit opening with tenor selection and interest rate showcase",
    icon: "🏧",
    screens: ["welcome", "auth", "fd-offer", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Grow Your Money with Top FD Rates!",
      subheadline: "Up to 8.5% p.a. · Guaranteed returns",
      ctaText: "Book FD Now",
      successMessage: "FD Booked Successfully!",
      fdAmount: 100000,
      fdTenor: 12,
      fdRate: 7.5,
      fdInterestPayout: "cumulative",
      nudges: { ...STANDARD_NUDGES, preApprovedBadge: false },
      useCaseCategory: "liabilities",
    },
  },

  // ── Collections ────────────────────────────────────────────────────────────────
  {
    id: "payment-journey",
    category: "collections",
    name: "Payment Journey",
    description: "Guide customers to pay outstanding dues with multiple payment options",
    icon: "💸",
    screens: ["welcome", "auth", "payment-summary", "payment-options", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Clear Your Dues — It's Quick!",
      subheadline: "Multiple payment options available",
      ctaText: "Pay Now",
      successMessage: "Payment Successful!",
      outstandingAmount: 28500,
      nudges: COLLECTIONS_NUDGES,
      useCaseCategory: "collections",
    },
  },
  {
    id: "settlement-offer",
    category: "collections",
    name: "Settlement Offer",
    description: "Offer a one-time settlement discount to resolve long-standing dues",
    icon: "🤝",
    screens: ["welcome", "auth", "settlement-screen", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Special Settlement Offer for You",
      subheadline: "Settle for less · Close your account today",
      ctaText: "View Settlement Offer",
      successMessage: "Account Settled — Congrats!",
      outstandingAmount: 45000,
      settlementPercentage: 80,
      nudges: { ...COLLECTIONS_NUDGES, scarcityTimer: true, scarcityHours: 24 },
      useCaseCategory: "collections",
    },
  },

  // ── Other ──────────────────────────────────────────────────────────────────────
  {
    id: "other",
    category: "other",
    name: "Other / Custom Use Case",
    description: "Describe your own use case and build a custom journey",
    icon: "✨",
    screens: ["welcome", "auth", "other-use-case", "confirm", "otp", "success"],
    defaultConfig: {
      headline: "Your Exclusive Offer Awaits",
      subheadline: "Personalised just for you",
      ctaText: "Get Started",
      successMessage: "All Done!",
      nudges: STANDARD_NUDGES,
      useCaseCategory: "other",
    },
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getUseCaseById(id: UseCaseId): UseCase | undefined {
  return USE_CASES.find((u) => u.id === id);
}

export function getUseCasesByCategory(category: UseCaseCategory): UseCase[] {
  return USE_CASES.filter((u) => u.category === category && !u.legacy);
}

export function getDefaultAuthFields(category: UseCaseCategory): AuthField[] {
  return category === "cards" ? DEFAULT_CARD_AUTH_FIELDS : DEFAULT_LOAN_AUTH_FIELDS;
}

// ─── Screen sequence builder ──────────────────────────────────────────────────

export function getScreensForUseCase(
  useCase: UseCase,
  config: PrototypeConfig
): ScreenId[] {
  const screens: ScreenId[] = [];

  // Campaign preview prepended before all other screens
  if (config.journeyType === "campaign") {
    screens.push("campaign-preview");
  }

  // Handle "other" use case with custom screen picks
  if (
    useCase.id === "other" &&
    config.otherUseCaseMode === "pick" &&
    config.otherUseCaseScreens &&
    config.otherUseCaseScreens.length > 0
  ) {
    screens.push(...config.otherUseCaseScreens);
  } else {
    screens.push(...useCase.screens);
  }

  // Inject rejection screen before confirm (if enabled)
  if (config.showRejectionFlow) {
    const confirmIdx = screens.indexOf("confirm");
    if (confirmIdx > 0) {
      screens.splice(confirmIdx, 0, "rejected");
    }
  }

  return screens;
}

// ─── Default config ────────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: PrototypeConfig = {
  customerName: "Rahul",
  creditLimit: 150000,
  interestRate: 10.99,
  loanAmount: 500000,
  tenure: 36,
  emi: 16347,
  transactionAmount: 45000,
  outstandingAmount: 28500,
  settlementPercentage: 80,
  nudges: STANDARD_NUDGES,
  showRejectionFlow: false,
  headline: "Your Exclusive Offer is Ready!",
  subheadline: "Activate in under 2 minutes",
  ctaText: "Get Started",
  successMessage: "All done! You're set.",
  journeyType: "organic",
  campaignChannel: "sms",
  authType: "default",
  authFields: [],
  useCaseCategory: "cards",
  currentCreditLimit: 100000,
  newCreditLimit: 200000,
  currentSpendLimit: 50000,
  newSpendLimit: 100000,
  cardTier: "Gold",
  upgradeCardTier: "Platinum",
  addOnCardholderName: "Priya",
  dormancyDays: 365,
  cardControls: { onlineTxn: true, internationalTxn: false, contactless: true, atmWithdrawal: true, ecommerce: true },
  existingLoanAmount: 300000,
  topUpAmount: 200000,
  remainingTenure: 18,
  fdAmount: 100000,
  fdTenor: 12,
  fdRate: 7.5,
  fdInterestPayout: "cumulative",
  accountType: "savings",
  minimumBalance: 0,
};

// ─── Finance utilities ────────────────────────────────────────────────────────

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (annualRate === 0) return Math.round(principal / tenureMonths);
  const r = annualRate / 12 / 100;
  return Math.round((principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1));
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
