"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrency, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

const BENEFITS = [
  { icon: "⚡", label: "Instant activation" },
  { icon: "📄", label: "No documentation required" },
  { icon: "📈", label: "Improves credit score" },
];

export default function CLIOfferScreen({ bank, config, onNext }: Props) {
  const [visible, setVisible] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  const current = config.currentCreditLimit ?? 100000;
  const next = config.newCreditLimit ?? 200000;
  const increaseAmt = next - current;
  const increasePercent = Math.round((increaseAmt / current) * 100);
  const barPercent = Math.min(100, Math.round((current / next) * 100));

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 200);
    const t2 = setTimeout(() => setBarWidth(barPercent), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [barPercent]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 flex items-center gap-3"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <button className="text-white opacity-80 text-xl leading-none">&#8592;</button>
        <div>
          <p className="text-white font-bold text-base">Credit Limit Upgrade</p>
          <p className="text-white text-xs opacity-70">{bank.name}</p>
        </div>
        {config.nudges.preApprovedBadge && (
          <div className="ml-auto bg-green-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-700 rounded-full animate-pulse" />
            PRE-APPROVED
          </div>
        )}
      </div>

      {!visible ? (
        <div className="flex-1 p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          className={`flex-1 overflow-y-auto px-5 py-4 space-y-5 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Hero upgrade badge */}
          <div
            className="rounded-2xl p-5 text-center relative overflow-hidden shadow-md"
            style={{
              background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`,
            }}
          >
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10 bg-white" />
            <div className="inline-flex items-center gap-1.5 bg-white bg-opacity-20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              <span>&#8593;</span> +{increasePercent}% increase
            </div>
            <p className="text-white font-bold text-sm opacity-80">Your new credit limit</p>
            <p className="text-white text-4xl font-extrabold mt-1">
              {formatCurrencyFull(next)}
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-gray-500 text-xs mb-1">Current Limit</p>
              <p className="text-gray-900 font-extrabold text-lg">{formatCurrency(current)}</p>
              <p className="text-gray-400 text-xs mt-0.5">Active now</p>
            </div>
            <div
              className="rounded-2xl p-4 shadow-sm text-center"
              style={{ backgroundColor: bank.bgLight }}
            >
              <p className="text-xs mb-1" style={{ color: bank.primaryColor, opacity: 0.7 }}>
                New Limit
              </p>
              <p className="font-extrabold text-lg" style={{ color: bank.primaryColor }}>
                {formatCurrency(next)}
              </p>
              <p className="text-xs mt-0.5" style={{ color: bank.primaryColor, opacity: 0.6 }}>
                After upgrade
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between mb-2">
              <p className="text-gray-500 text-xs font-medium">Limit Utilisation After Upgrade</p>
              <p className="text-xs font-bold" style={{ color: bank.primaryColor }}>
                {formatCurrency(current)} / {formatCurrency(next)}
              </p>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: bank.primaryColor,
                }}
              />
            </div>
            <p className="text-gray-400 text-xs mt-2">
              &#43;{formatCurrencyFull(increaseAmt)} additional spending power
            </p>
          </div>

          {/* Benefits */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Upgrade Highlights
            </p>
            <div className="space-y-2">
              {BENEFITS.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm"
                >
                  <span className="text-lg">{icon}</span>
                  <p className="text-gray-800 text-sm font-medium">{label}</p>
                  <div
                    className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: bank.primaryColor }}
                  >
                    ✓
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scarcity */}
          {config.nudges.scarcityTimer && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span className="text-lg">&#9201;</span>
              <div>
                <p className="text-amber-800 text-xs font-bold">Limited Time Offer</p>
                <p className="text-amber-900 font-extrabold text-sm">
                  Valid for {config.nudges.scarcityHours} hours only
                </p>
              </div>
            </div>
          )}

          {/* Social proof */}
          {config.nudges.socialProof && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <span className="text-lg">&#128101;</span>
              <p className="text-blue-800 text-xs">
                <span className="font-bold">
                  {config.nudges.socialProofCount.toLocaleString("en-IN")}+
                </span>{" "}
                customers upgraded their limit this month
              </p>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="px-5 pb-5 pt-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: bank.primaryColor }}
        >
          {config.ctaText} →
        </button>
        <p className="text-center text-gray-400 text-xs mt-2">
          No documentation · No credit score impact
        </p>
      </div>
    </div>
  );
}
