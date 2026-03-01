"use client";

import { Bank } from "@/lib/banks";
import { PrototypeConfig, UseCaseId, formatCurrency, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  useCaseId: UseCaseId;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function WelcomeScreen({ bank, useCaseId, config, onNext }: Props) {
  const { nudges, customerName, headline, subheadline, ctaText } = config;

  const getOfferAmount = () => {
    if (useCaseId === "credit-card") return formatCurrencyFull(config.creditLimit);
    if (useCaseId === "personal-loan") return formatCurrencyFull(config.loanAmount);
    if (useCaseId === "emi-conversion") return formatCurrencyFull(config.transactionAmount);
    if (useCaseId === "collections") return formatCurrencyFull(config.outstandingAmount);
    return "";
  };

  const getOfferLabel = () => {
    if (useCaseId === "credit-card") return "Credit Limit";
    if (useCaseId === "personal-loan") return "Pre-approved up to";
    if (useCaseId === "emi-conversion") return "Convert";
    if (useCaseId === "collections") return "Outstanding Due";
    return "";
  };

  const formatHours = (h: number) => {
    if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
    return `${h}h`;
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: bank.bgLight }}>
      {/* Hero gradient */}
      <div
        className="px-5 pt-5 pb-8 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
          style={{ backgroundColor: bank.textOnPrimary }}
        />
        <div
          className="absolute bottom-0 -left-6 w-28 h-28 rounded-full opacity-10"
          style={{ backgroundColor: bank.textOnPrimary }}
        />

        {/* Pre-approved badge */}
        {nudges.preApprovedBadge && useCaseId !== "collections" && (
          <div className="inline-flex items-center gap-1.5 bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 bg-green-700 rounded-full animate-pulse" />
            PRE-APPROVED
          </div>
        )}

        {/* Headline */}
        <p className="text-white text-lg font-bold leading-snug">
          Hi {customerName}! 👋
        </p>
        <p className="text-white text-xl font-extrabold leading-tight mt-1">
          {headline}
        </p>
        <p className="text-white text-opacity-80 text-sm mt-2 opacity-80">
          {subheadline}
        </p>

        {/* Offer amount pill */}
        <div className="mt-4 inline-block bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl px-5 py-3">
          <p className="text-white text-xs opacity-70">{getOfferLabel()}</p>
          <p className="text-white text-2xl font-extrabold">{getOfferAmount()}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 pt-5 space-y-3">
        {/* Scarcity timer */}
        {nudges.scarcityTimer && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <span className="text-lg">⏰</span>
            <div>
              <p className="text-amber-800 text-xs font-bold">Offer expires in</p>
              <p className="text-amber-900 font-extrabold text-sm">
                {formatHours(nudges.scarcityHours)}
              </p>
            </div>
          </div>
        )}

        {/* Social proof */}
        {nudges.socialProof && useCaseId !== "collections" && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <span className="text-lg">👥</span>
            <p className="text-blue-800 text-xs">
              <span className="font-bold">
                {nudges.socialProofCount.toLocaleString("en-IN")}+
              </span>{" "}
              customers already activated this month
            </p>
          </div>
        )}

        {/* Savings meter */}
        {nudges.savingsMeter && useCaseId !== "collections" && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-3">
            <span className="text-lg">💰</span>
            <div>
              <p className="text-green-700 text-xs">Estimated annual savings</p>
              <p className="text-green-800 font-extrabold text-sm">
                {formatCurrency(nudges.savingsAmount)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-4 pt-3">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: bank.primaryColor }}
        >
          {ctaText} →
        </button>
        <p className="text-center text-gray-400 text-xs mt-2">
          100% secure · No impact on credit score
        </p>
      </div>
    </div>
  );
}
