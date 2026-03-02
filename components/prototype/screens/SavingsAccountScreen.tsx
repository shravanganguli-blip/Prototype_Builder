"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

type TabType = "savings" | "salary" | "current";

const ACCOUNT_FEATURES: Record<TabType, { title: string; subtitle: string; highlights: string[] }> = {
  savings: {
    title: "Savings Account",
    subtitle: "Earn more on every rupee",
    highlights: ["High interest on daily balance", "Instant fund transfers (IMPS/NEFT)", "Exclusive debit card rewards"],
  },
  salary: {
    title: "Salary Account",
    subtitle: "Your money, your terms",
    highlights: ["Salary credited on day 1", "Auto-sweep to FD at ₹10K+", "Salary advance up to 3x"],
  },
  current: {
    title: "Current Account",
    subtitle: "Power your business",
    highlights: ["Unlimited transactions", "Bulk payment support", "Dedicated relationship manager"],
  },
};

export default function SavingsAccountScreen({ bank, config, onNext }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(config.accountType ?? "savings");

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const features = ACCOUNT_FEATURES[activeTab];
  const minBalance = config.minimumBalance ?? 0;

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-4 flex items-center gap-3 shrink-0"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-white/70 text-xs font-medium">{bank.shortName}</p>
          <p className="text-white font-bold text-base leading-tight">Open Account</p>
        </div>
        {config.nudges.preApprovedBadge && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: bank.accentColor, color: "#fff" }}
          >
            INSTANT
          </span>
        )}
      </div>

      {/* Tab selector */}
      <div
        className="px-4 pb-4 shrink-0"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <div className="bg-white/15 rounded-xl p-1 flex gap-1">
          {(["savings", "salary", "current"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white shadow-sm"
                  : "text-white/80"
              }`}
              style={{ color: activeTab === tab ? bank.primaryColor : undefined }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!loaded ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-48 rounded-2xl bg-gray-200" />
            <div className="h-36 rounded-2xl bg-gray-200" />
            <div className="h-32 rounded-2xl bg-gray-200" />
          </div>
        ) : (
          <div
            className={`space-y-4 transition-all duration-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Benefits card */}
            <div
              className="rounded-2xl p-5 shadow-lg relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bank.primaryColor} 0%, ${bank.secondaryColor} 100%)`,
              }}
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">{features.title}</p>
                    <p className="text-white/70 text-xs mt-0.5">{features.subtitle}</p>
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-2 text-center">
                    <p className="text-white font-extrabold text-xl leading-tight">{config.interestRate}%</p>
                    <p className="text-white/70 text-[10px]">p.a.</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-4">
                  {features.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white/90 text-xs">{h}</p>
                    </div>
                  ))}
                </div>

                {/* Min balance + features row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-white/60 text-[9px] uppercase tracking-wide mb-1">Min. Balance</p>
                    <p className="text-white font-bold text-xs">
                      {minBalance === 0 ? "Zero" : formatCurrencyFull(minBalance)}
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-white/60 text-[9px] uppercase tracking-wide mb-1">Debit Card</p>
                    <p className="text-white font-bold text-xs">Free</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-2.5 text-center">
                    <p className="text-white/60 text-[9px] uppercase tracking-wide mb-1">Insurance</p>
                    <p className="text-white font-bold text-xs">₹5L</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key features */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">What You Get</p>
              <div className="space-y-3">
                {[
                  { icon: "💳", label: "Free Debit Card", desc: "Lifetime free Visa/Mastercard debit card" },
                  { icon: "📱", label: "Net Banking & App", desc: "24/7 access via mobile & internet banking" },
                  { icon: "🔒", label: "DICGC Insured", desc: "Deposits insured up to ₹5 Lakhs per depositor" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: bank.bgLight }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{f.label}</p>
                      <p className="text-gray-400 text-xs">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-4">How It Works</p>
              <div className="space-y-4">
                {[
                  { step: "01", title: "Complete KYC", desc: "Aadhaar + PAN — fully paperless" },
                  { step: "02", title: "Account in 2 Minutes", desc: "Get your account number instantly" },
                  { step: "03", title: "Debit Card Delivered", desc: "Physical card in 3–5 business days" },
                ].map((s, i) => (
                  <div key={s.step} className="flex gap-3 items-start">
                    <div className="relative flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                        style={{ backgroundColor: bank.bgLight, color: bank.primaryColor }}
                      >
                        {s.step}
                      </div>
                      {i < 2 && (
                        <div
                          className="w-0.5 h-4 mt-1 opacity-30"
                          style={{ backgroundColor: bank.primaryColor }}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="text-gray-900 text-sm font-semibold">{s.title}</p>
                      <p className="text-gray-400 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            {config.nudges.socialProof && (
              <div
                className="flex items-center gap-3 rounded-xl p-3 border"
                style={{ backgroundColor: bank.bgLight, borderColor: `${bank.primaryColor}20` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bank.primaryColor }}
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <p className="text-xs font-medium" style={{ color: bank.primaryColor }}>
                  Over 2 lakh accounts opened this month
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 bg-gray-50 shrink-0">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl font-extrabold text-base shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: bank.primaryColor, color: bank.textOnPrimary }}
        >
          {config.ctaText}
        </button>
        <p className="text-center text-gray-400 text-[10px] mt-2">
          100% digital · No branch visit needed
        </p>
      </div>
    </div>
  );
}
