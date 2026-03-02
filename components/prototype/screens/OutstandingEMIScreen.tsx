"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, calculateEMI, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

const EMI_PLANS = [
  { months: 3, label: "3 mo" },
  { months: 6, label: "6 mo" },
  { months: 12, label: "12 mo" },
];

export default function OutstandingEMIScreen({ bank, config, onNext }: Props) {
  const [visible, setVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(6);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const outstanding = config.outstandingAmount;
  const minDue = Math.round(outstanding * 0.1);
  const rate = config.interestRate;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 flex items-center gap-3"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <button className="text-white opacity-80 text-xl leading-none">&#8592;</button>
        <div>
          <p className="text-white font-bold text-base">Outstanding Balance</p>
          <p className="text-white text-xs opacity-70">{bank.name}</p>
        </div>
      </div>

      {/* Shimmer / Content */}
      {!visible ? (
        <div className="flex-1 p-5 space-y-4">
          {[100, 60, 80, 120].map((w, i) => (
            <div
              key={i}
              className="h-14 rounded-2xl bg-gray-200 animate-pulse"
              style={{ width: `${w}%`, maxWidth: "100%" }}
            />
          ))}
        </div>
      ) : (
        <div
          className={`flex-1 overflow-y-auto px-5 py-4 space-y-4 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Outstanding amount card */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden shadow-md"
            style={{
              background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`,
            }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white" />
            <div className="absolute bottom-0 -left-4 w-20 h-20 rounded-full opacity-10 bg-white" />
            <p className="text-white text-xs opacity-70 font-medium uppercase tracking-wider">
              Total Outstanding
            </p>
            <p className="text-white text-4xl font-extrabold mt-1">
              {formatCurrencyFull(outstanding)}
            </p>
            <p className="text-white text-xs opacity-60 mt-1">As of 01 Mar 2026</p>

            <div className="mt-4 flex gap-4">
              <div className="flex-1 bg-white bg-opacity-15 rounded-xl px-3 py-2">
                <p className="text-white text-xs opacity-70">Minimum Due</p>
                <p className="text-white font-extrabold text-sm">{formatCurrencyFull(minDue)}</p>
              </div>
              <div className="flex-1 bg-white bg-opacity-15 rounded-xl px-3 py-2">
                <p className="text-white text-xs opacity-70">Due Date</p>
                <p className="text-white font-extrabold text-sm">15 Mar 2026</p>
              </div>
            </div>
          </div>

          {/* EMI highlight box */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-green-700 font-extrabold text-sm">
                Convert to EMI — Stress-Free!
              </p>
            </div>
            <p className="text-green-600 text-xs">
              Break your outstanding into easy monthly payments at low interest.
            </p>
          </div>

          {/* EMI plan chips */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Choose a plan
            </p>
            <div className="grid grid-cols-3 gap-3">
              {EMI_PLANS.map(({ months, label }) => {
                const emi = calculateEMI(outstanding, rate, months);
                const isSelected = selectedPlan === months;
                return (
                  <button
                    key={months}
                    onClick={() => setSelectedPlan(months)}
                    className="rounded-2xl p-3 text-center border-2 transition-all duration-200 active:scale-95"
                    style={{
                      borderColor: isSelected ? bank.primaryColor : "#E5E7EB",
                      backgroundColor: isSelected ? bank.bgLight : "#FFFFFF",
                    }}
                  >
                    <p
                      className="text-xs font-semibold"
                      style={{ color: isSelected ? bank.primaryColor : "#6B7280" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-base font-extrabold mt-0.5"
                      style={{ color: isSelected ? bank.primaryColor : "#111827" }}
                    >
                      {formatCurrencyFull(emi)}
                    </p>
                    <p className="text-gray-400 text-xs">/month</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected plan breakdown */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Selected Plan — {selectedPlan} months
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Monthly EMI</p>
                <p className="font-extrabold text-gray-900 text-sm">
                  {formatCurrencyFull(calculateEMI(outstanding, rate, selectedPlan))}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Interest Rate</p>
                <p className="font-bold text-gray-900 text-sm">{rate}% p.a.</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Total Payable</p>
                <p className="font-bold text-gray-900 text-sm">
                  {formatCurrencyFull(
                    calculateEMI(outstanding, rate, selectedPlan) * selectedPlan
                  )}
                </p>
              </div>
            </div>
          </div>
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
          No foreclosure charges · Instant activation
        </p>
      </div>
    </div>
  );
}
