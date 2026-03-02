"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

const VALUE_PROPS = [
  { icon: "⚡", title: "Instant Processing", desc: "Real-time approvals — no waiting" },
  { icon: "🔒", title: "100% Secure", desc: "Bank-grade encryption at every step" },
  { icon: "🎁", title: "Exclusive Benefits", desc: "Personalised just for your profile" },
];

export default function OtherUseCaseScreen({ bank, config, onNext }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const hasContext = Boolean(config.otherUseCaseDescription?.trim());

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
          <p className="text-white font-bold text-base leading-tight">Your Offer</p>
        </div>
        {config.nudges.preApprovedBadge && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: bank.accentColor, color: "#fff" }}
          >
            EXCLUSIVE
          </span>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!loaded ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-52 rounded-2xl bg-gray-200" />
            <div className="h-36 rounded-2xl bg-gray-200" />
            <div className="h-24 rounded-2xl bg-gray-200" />
          </div>
        ) : (
          <div
            className={`space-y-4 transition-all duration-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Main offer card */}
            <div
              className="rounded-2xl p-5 shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bank.primaryColor} 0%, ${bank.secondaryColor} 100%)`,
              }}
            >
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-white/5" />
              {/* Decorative sparkle dots */}
              <div className="absolute top-4 right-16 w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="absolute top-10 right-10 w-1 h-1 rounded-full bg-white/20" />
              <div className="absolute bottom-8 right-20 w-1 h-1 rounded-full bg-white/20" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl"
                  >
                    ✨
                  </div>
                  <div className="bg-white/15 rounded-xl px-3 py-1.5">
                    <p className="text-white/70 text-[10px] uppercase tracking-wide">For</p>
                    <p className="text-white font-bold text-xs">{config.customerName}</p>
                  </div>
                </div>

                <p className="text-white font-extrabold text-2xl leading-tight mb-2">
                  {config.headline}
                </p>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {config.subheadline}
                </p>

                <div className="h-px bg-white/15 mb-4" />

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-white/80 text-xs">Offer ready to activate</p>
                </div>
              </div>
            </div>

            {/* Value props */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Why Take This Offer</p>
              <div className="space-y-3">
                {VALUE_PROPS.map((v) => (
                  <div key={v.title} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: bank.bgLight }}
                    >
                      {v.icon}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{v.title}</p>
                      <p className="text-gray-400 text-xs">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nudges */}
            {config.nudges.scarcityTimer && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                <span className="text-amber-500">⏰</span>
                <p className="text-amber-800 text-xs font-medium">
                  Limited time offer — valid for the next {config.nudges.scarcityHours}h only
                </p>
              </div>
            )}

            {config.nudges.socialProof && (
              <div
                className="flex items-center gap-3 rounded-xl p-3 border"
                style={{ backgroundColor: bank.bgLight, borderColor: `${bank.primaryColor}20` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
                  style={{ backgroundColor: bank.primaryColor }}
                >
                  👥
                </div>
                <p className="text-xs font-medium" style={{ color: bank.primaryColor }}>
                  {config.nudges.socialProofCount.toLocaleString("en-IN")}+ customers have availed this offer
                </p>
              </div>
            )}

            {/* Use case context */}
            {hasContext && (
              <div className="bg-gray-100 rounded-xl p-3 border border-gray-200">
                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wide mb-1">
                  Use Case Context
                </p>
                <p className="text-gray-500 text-xs italic leading-relaxed">
                  {config.otherUseCaseDescription}
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
          Secure · Instant · Personalised for you
        </p>
      </div>
    </div>
  );
}
