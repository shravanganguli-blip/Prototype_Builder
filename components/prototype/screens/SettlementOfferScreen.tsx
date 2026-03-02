"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

function useCountdown(active: boolean, hours: number) {
  const totalSeconds = hours * 3600;
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return {
    display: `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`,
    h, m, s,
  };
}

export default function SettlementOfferScreen({ bank, config, onNext }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const outstanding = config.outstandingAmount ?? 45000;
  const pct = config.settlementPercentage ?? 80;
  const settlementAmount = Math.round(outstanding * pct / 100);
  const savings = outstanding - settlementAmount;
  const savingsPct = 100 - pct;

  const scarcityHours = config.nudges.scarcityHours ?? 24;
  const countdown = useCountdown(config.nudges.scarcityTimer, scarcityHours);

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
          <p className="text-white font-bold text-base leading-tight">Settlement Offer</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">
          ONE-TIME
        </span>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!loaded ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 rounded-2xl bg-gray-200" />
            <div className="h-56 rounded-2xl bg-gray-200" />
            <div className="h-32 rounded-2xl bg-gray-200" />
          </div>
        ) : (
          <div
            className={`space-y-4 transition-all duration-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Outstanding amount */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-600 text-xs font-semibold uppercase tracking-wide">Outstanding Amount</p>
              </div>
              <p className="text-red-600 font-extrabold text-3xl">{formatCurrencyFull(outstanding)}</p>
              <p className="text-gray-400 text-xs mt-1">Total dues as of today</p>
            </div>

            {/* Timer */}
            {config.nudges.scarcityTimer && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-amber-800 text-xs font-semibold">Offer Expires In</p>
                  <p className="text-amber-900 font-extrabold text-lg font-mono tracking-wider">{countdown.display}</p>
                </div>
              </div>
            )}

            {/* Settlement offer card */}
            <div
              className="rounded-2xl p-5 shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bank.primaryColor} 0%, ${bank.secondaryColor} 100%)`,
              }}
            >
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Special Offer</p>
                </div>

                <p className="text-white/70 text-xs mb-1">Settle for just</p>
                <p className="text-white font-extrabold text-4xl tracking-tight mb-1">
                  {formatCurrencyFull(settlementAmount)}
                </p>

                {/* Strikethrough original */}
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-white/50 text-base line-through">{formatCurrencyFull(outstanding)}</p>
                  <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    SAVE {savingsPct}%
                  </span>
                </div>

                {/* Savings callout */}
                <div className="bg-white/15 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="text-white/70 text-xs">You Save</p>
                    <p className="text-white font-bold text-lg">{formatCurrencyFull(savings)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Settlement %</p>
                    <p className="text-white font-bold text-lg">{pct}% of dues</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Settlement Includes</p>
              <div className="space-y-2.5">
                {[
                  "Full account closure on payment",
                  "No more late fees or penalties",
                  "NOC provided within 30 days",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="flex gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-600 text-xs leading-relaxed">
                This is a one-time offer. Post expiry, the full outstanding amount of {formatCurrencyFull(outstanding)} will be due.
              </p>
            </div>
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
          Settle {formatCurrencyFull(settlementAmount)} · Save {formatCurrencyFull(savings)} today
        </p>
      </div>
    </div>
  );
}
