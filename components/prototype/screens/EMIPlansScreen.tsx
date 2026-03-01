"use client";

import { useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, calculateEMI, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function EMIPlansScreen({ bank, config, onNext }: Props) {
  const amount = config.transactionAmount;
  const [selected, setSelected] = useState(1); // Default to middle option

  const plans = [
    { months: 3, rate: config.interestRate * 0.8, label: "" },
    { months: 6, rate: config.interestRate * 0.9, label: "Most Popular" },
    { months: 12, rate: config.interestRate, label: "" },
    { months: 18, rate: config.interestRate * 1.05, label: "" },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Choose EMI Plan</p>
        <p className="text-xs opacity-70 mt-0.5">
          Converting {formatCurrencyFull(amount)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {plans.map((plan, i) => {
          const emi = calculateEMI(amount, plan.rate, plan.months);
          const isSelected = selected === i;
          return (
            <button
              key={plan.months}
              onClick={() => setSelected(i)}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all relative`}
              style={
                isSelected
                  ? {
                      borderColor: bank.primaryColor,
                      backgroundColor: bank.bgLight,
                    }
                  : { borderColor: "#E5E7EB" }
              }
            >
              {plan.label && (
                <span
                  className="absolute -top-2 right-3 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: bank.accentColor }}
                >
                  {plan.label}
                </span>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {plan.months} months
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    at {plan.rate.toFixed(1)}% p.a.
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-extrabold text-lg"
                    style={isSelected ? { color: bank.primaryColor } : { color: "#111827" }}
                  >
                    {formatCurrencyFull(emi)}
                  </p>
                  <p className="text-xs text-gray-400">/ month</p>
                </div>
              </div>
              {isSelected && (
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: bank.primaryColor }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-5 pb-4 pt-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Confirm Plan →
        </button>
      </div>
    </div>
  );
}
