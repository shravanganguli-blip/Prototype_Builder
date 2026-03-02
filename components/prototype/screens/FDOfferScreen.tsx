"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

type PayoutType = "cumulative" | "monthly" | "quarterly";

const TENOR_OPTIONS: { label: string; months: number; rateBonus: number }[] = [
  { label: "3M", months: 3, rateBonus: -0.75 },
  { label: "6M", months: 6, rateBonus: -0.5 },
  { label: "9M", months: 9, rateBonus: -0.25 },
  { label: "12M", months: 12, rateBonus: 0 },
  { label: "18M", months: 18, rateBonus: 0.25 },
  { label: "24M", months: 24, rateBonus: 0.5 },
  { label: "36M", months: 36, rateBonus: 0.75 },
];

function calculateMaturity(principal: number, annualRate: number, months: number): number {
  // Simple interest for FD
  return Math.round(principal * (1 + (annualRate / 100) * (months / 12)));
}

export default function FDOfferScreen({ bank, config, onNext }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [selectedTenor, setSelectedTenor] = useState<number>(config.fdTenor ?? 12);
  const [payout, setPayout] = useState<PayoutType>(config.fdInterestPayout ?? "cumulative");

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const baseRate = config.fdRate ?? 7.5;
  const fdAmount = config.fdAmount ?? 100000;

  const tenorOption = TENOR_OPTIONS.find((t) => t.months === selectedTenor) ?? TENOR_OPTIONS[3];
  const effectiveRate = Math.max(baseRate + tenorOption.rateBonus, 3.0);
  const seniorRate = effectiveRate + 0.25;

  const maturityAmount = calculateMaturity(fdAmount, effectiveRate, selectedTenor);
  const interestEarned = maturityAmount - fdAmount;

  // Maturity date
  const maturityDate = new Date();
  maturityDate.setMonth(maturityDate.getMonth() + selectedTenor);
  const maturityDateStr = maturityDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
          <p className="text-white font-bold text-base leading-tight">Book Fixed Deposit</p>
        </div>
        <div className="bg-white/15 rounded-xl px-3 py-1.5 text-center">
          <p className="text-white font-extrabold text-lg leading-tight">{effectiveRate.toFixed(2)}%</p>
          <p className="text-white/70 text-[10px]">p.a.</p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!loaded ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 rounded-2xl bg-gray-200" />
            <div className="h-24 rounded-2xl bg-gray-200" />
            <div className="h-16 rounded-2xl bg-gray-200" />
            <div className="h-36 rounded-2xl bg-gray-200" />
          </div>
        ) : (
          <div
            className={`space-y-4 transition-all duration-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Amount input */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Deposit Amount</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0"
                  style={{ backgroundColor: bank.bgLight, color: bank.primaryColor }}
                >
                  ₹
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-extrabold text-2xl tracking-tight">
                    {formatCurrencyFull(fdAmount)}
                  </p>
                  <p className="text-gray-400 text-xs">Pre-filled from your profile</p>
                </div>
                <button
                  className="text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: bank.bgLight, color: bank.primaryColor }}
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Tenor selector */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Select Tenor</p>
              <div className="grid grid-cols-4 gap-2">
                {TENOR_OPTIONS.map((t) => {
                  const tRate = Math.max(baseRate + t.rateBonus, 3.0);
                  const isSelected = selectedTenor === t.months;
                  return (
                    <button
                      key={t.months}
                      onClick={() => setSelectedTenor(t.months)}
                      className={`relative py-3 rounded-xl border-2 transition-all duration-150 ${
                        isSelected ? "shadow-md" : "border-gray-100"
                      }`}
                      style={{
                        borderColor: isSelected ? bank.primaryColor : undefined,
                        backgroundColor: isSelected ? bank.bgLight : undefined,
                      }}
                    >
                      <p
                        className={`font-bold text-sm ${isSelected ? "" : "text-gray-700"}`}
                        style={{ color: isSelected ? bank.primaryColor : undefined }}
                      >
                        {t.label}
                      </p>
                      <p
                        className={`text-[9px] font-medium ${isSelected ? "" : "text-gray-400"}`}
                        style={{ color: isSelected ? bank.primaryColor : undefined }}
                      >
                        {tRate.toFixed(2)}%
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rate display */}
            <div
              className="rounded-2xl p-4 relative overflow-hidden shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${bank.primaryColor} 0%, ${bank.secondaryColor} 100%)`,
              }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs">Interest Rate</p>
                  <p className="text-white font-extrabold text-3xl">{effectiveRate.toFixed(2)}%</p>
                  <p className="text-white/60 text-xs">per annum · {selectedTenor} months</p>
                </div>
                <div className="text-right">
                  <div className="bg-white/15 rounded-xl px-3 py-2 mb-1">
                    <p className="text-white/70 text-[10px] uppercase tracking-wide">Senior Citizens</p>
                    <p className="text-white font-bold text-base">{seniorRate.toFixed(2)}%</p>
                    <p className="text-white/60 text-[9px]">+0.25% extra</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interest payout */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Interest Payout</p>
              <div className="grid grid-cols-3 gap-2">
                {(["cumulative", "monthly", "quarterly"] as PayoutType[]).map((p) => {
                  const isSelected = payout === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPayout(p)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-bold capitalize transition-all duration-150 ${
                        isSelected ? "shadow-sm" : "border-gray-100 text-gray-500"
                      }`}
                      style={{
                        borderColor: isSelected ? bank.primaryColor : undefined,
                        backgroundColor: isSelected ? bank.bgLight : undefined,
                        color: isSelected ? bank.primaryColor : undefined,
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Maturity calculation */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-emerald-700 font-bold text-sm">Your Returns</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-emerald-700 text-sm">Maturity Amount</p>
                  <p className="text-emerald-800 font-extrabold text-xl">{formatCurrencyFull(maturityAmount)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-emerald-600 text-xs">Interest Earned</p>
                  <p className="text-emerald-700 font-bold text-sm">+{formatCurrencyFull(interestEarned)}</p>
                </div>
                <div
                  className="w-full bg-emerald-200 rounded-full overflow-hidden"
                  style={{ height: "6px" }}
                >
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min((interestEarned / fdAmount) * 100 * 4, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px]">
                  <p className="text-emerald-600">Principal: {formatCurrencyFull(fdAmount)}</p>
                  <p className="text-emerald-600">Matures: {maturityDateStr}</p>
                </div>
              </div>
            </div>

            {/* Senior citizen note */}
            <div
              className="flex items-start gap-2 rounded-xl p-3 border"
              style={{ backgroundColor: bank.bgLight, borderColor: `${bank.primaryColor}20` }}
            >
              <span className="text-lg shrink-0">👴</span>
              <div>
                <p className="text-xs font-semibold" style={{ color: bank.primaryColor }}>
                  Senior Citizen Benefit
                </p>
                <p className="text-gray-500 text-xs">
                  Citizens aged 60+ earn an additional 0.25% p.a. — {seniorRate.toFixed(2)}% for this tenor.
                </p>
              </div>
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
          Guaranteed returns · DICGC insured up to ₹5L
        </p>
      </div>
    </div>
  );
}
