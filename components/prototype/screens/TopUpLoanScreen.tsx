"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrencyFull, calculateEMI } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function TopUpLoanScreen({ bank, config, onNext }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const existingLoan = config.existingLoanAmount ?? 300000;
  const topUp = config.topUpAmount ?? 200000;
  const totalLoan = existingLoan + topUp;
  const topUpEMI = calculateEMI(topUp, config.interestRate, config.tenure);
  const existingEMI = calculateEMI(existingLoan, config.interestRate, config.remainingTenure ?? 18);
  const combinedEMI = topUpEMI + existingEMI;

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
          <p className="text-white font-bold text-base leading-tight">Loan Top-Up</p>
        </div>
        {config.nudges.preApprovedBadge && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: bank.accentColor, color: bank.textOnPrimary }}
          >
            PRE-APPROVED
          </span>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!loaded ? (
          /* Shimmer */
          <div className="space-y-4 animate-pulse">
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="h-6 w-8 rounded-full bg-gray-200 mx-auto" />
            <div className="h-40 rounded-2xl bg-gray-200" />
            <div className="h-24 rounded-2xl bg-gray-200" />
          </div>
        ) : (
          <div
            className={`space-y-4 transition-all duration-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Existing loan card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Current Loan</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide mb-1">Existing Loan</p>
                  <p className="text-gray-900 font-extrabold text-lg">{formatCurrencyFull(existingLoan)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wide mb-1">Remaining Tenure</p>
                  <p className="text-gray-900 font-extrabold text-lg">{config.remainingTenure ?? 18} <span className="text-sm font-medium text-gray-500">mos</span></p>
                </div>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex flex-col items-center gap-1 py-1">
              <div
                className="w-0.5 h-4 rounded-full opacity-40"
                style={{ backgroundColor: bank.primaryColor }}
              />
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: bank.primaryColor }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                </svg>
              </div>
              <div
                className="w-0.5 h-4 rounded-full opacity-40"
                style={{ backgroundColor: bank.primaryColor }}
              />
            </div>

            {/* Top-up offer card */}
            <div
              className="rounded-2xl p-5 shadow-lg relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bank.primaryColor} 0%, ${bank.secondaryColor} 100%)`,
              }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Top-Up Offer</p>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: bank.accentColor, color: "#fff" }}
                  >
                    INSTANT
                  </span>
                </div>

                <p className="text-white/70 text-xs mb-1">Top-Up Amount</p>
                <p className="text-white font-extrabold text-4xl tracking-tight mb-4">
                  {formatCurrencyFull(topUp)}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-white/60 text-[10px] uppercase tracking-wide mb-1">Interest Rate</p>
                    <p className="text-white font-bold text-base">{config.interestRate}% <span className="text-white/70 text-xs font-normal">p.a.</span></p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-white/60 text-[10px] uppercase tracking-wide mb-1">New Tenure</p>
                    <p className="text-white font-bold text-base">{config.tenure} <span className="text-white/70 text-xs font-normal">months</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Combined summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Post Top-Up Summary</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <p className="text-gray-600 text-sm">Total Outstanding</p>
                  </div>
                  <p className="text-gray-900 font-bold text-sm">{formatCurrencyFull(totalLoan)}</p>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bank.accentColor }} />
                    <p className="text-gray-600 text-sm">Top-Up EMI</p>
                  </div>
                  <p className="text-gray-900 font-bold text-sm">{formatCurrencyFull(topUpEMI)}/mo</p>
                </div>

                <div
                  className="flex justify-between items-center rounded-xl p-3"
                  style={{ backgroundColor: bank.bgLight }}
                >
                  <div>
                    <p className="text-xs font-semibold" style={{ color: bank.primaryColor }}>Combined EMI</p>
                    <p className="text-gray-500 text-[10px]">incl. existing loan</p>
                  </div>
                  <p className="font-extrabold text-xl" style={{ color: bank.primaryColor }}>
                    {formatCurrencyFull(combinedEMI)}<span className="text-xs font-medium">/mo</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Info note */}
            <div className="flex gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-amber-700 text-xs leading-relaxed">
                Combined EMI includes both your existing loan repayment and new top-up amount. Actual rate may vary.
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
          By proceeding, you agree to the terms &amp; conditions
        </p>
      </div>
    </div>
  );
}
