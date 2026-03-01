"use client";

import { Bank } from "@/lib/banks";
import {
  PrototypeConfig,
  UseCaseId,
  formatCurrencyFull,
  calculateEMI,
} from "@/lib/journeys";

interface Props {
  bank: Bank;
  useCaseId: UseCaseId;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function ConfirmScreen({ bank, useCaseId, config, onNext }: Props) {
  const emi = config.emi || calculateEMI(config.loanAmount, config.interestRate, config.tenure);

  const rows: [string, string][] = [];

  if (useCaseId === "personal-loan") {
    rows.push(
      ["Loan Amount", formatCurrencyFull(config.loanAmount)],
      ["Interest Rate", `${config.interestRate}% p.a.`],
      ["Tenure", `${config.tenure} months`],
      ["Monthly EMI", formatCurrencyFull(emi)],
      ["First EMI Date", "01 Apr 2026"],
      ["Disbursal Account", "••••3847"]
    );
  } else if (useCaseId === "emi-conversion") {
    rows.push(
      ["Transaction Amount", formatCurrencyFull(config.transactionAmount)],
      ["EMI Plan", `${config.tenure} months`],
      ["Monthly EMI", formatCurrencyFull(calculateEMI(config.transactionAmount, config.interestRate, config.tenure))],
      ["Interest Rate", `${config.interestRate}% p.a.`],
      ["Processing Fee", "₹0"]
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Confirm & Apply</p>
        <p className="text-xs opacity-70 mt-0.5">Review before proceeding</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Summary card */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: `linear-gradient(135deg, ${bank.primaryColor}15, ${bank.bgLight})`,
            border: `1.5px solid ${bank.primaryColor}33`,
          }}
        >
          <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wide">
            Summary
          </p>
          <div className="space-y-3">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="font-bold text-sm text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* T&C */}
        <div className="flex items-start gap-3">
          <div
            className="w-5 h-5 rounded flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5"
            style={{ backgroundColor: bank.primaryColor }}
          >
            ✓
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            I agree to the{" "}
            <span style={{ color: bank.primaryColor }} className="font-medium underline">
              Terms & Conditions
            </span>{" "}
            and authorise {bank.name} to process my application. I confirm all
            details are accurate.
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 pt-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Verify with OTP →
        </button>
      </div>
    </div>
  );
}
