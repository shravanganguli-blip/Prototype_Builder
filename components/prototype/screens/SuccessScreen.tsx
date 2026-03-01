"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, UseCaseId, formatCurrencyFull, calculateEMI } from "@/lib/journeys";

interface Props {
  bank: Bank;
  useCaseId: UseCaseId;
  config: PrototypeConfig;
}

export default function SuccessScreen({ bank, useCaseId, config }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getDetails = (): [string, string][] => {
    if (useCaseId === "credit-card") {
      return [
        ["Card Number", "•••• •••• •••• 4291"],
        ["Credit Limit", formatCurrencyFull(config.creditLimit)],
        ["Status", "Active"],
      ];
    }
    if (useCaseId === "personal-loan") {
      const emi = config.emi || calculateEMI(config.loanAmount, config.interestRate, config.tenure);
      return [
        ["Amount Disbursed", formatCurrencyFull(config.loanAmount)],
        ["Monthly EMI", formatCurrencyFull(emi)],
        ["First EMI Date", "01 Apr 2026"],
      ];
    }
    if (useCaseId === "emi-conversion") {
      const emi = calculateEMI(config.transactionAmount, config.interestRate, config.tenure);
      return [
        ["Transaction Amount", formatCurrencyFull(config.transactionAmount)],
        ["Monthly EMI", formatCurrencyFull(emi)],
        ["Tenure", `${config.tenure} months`],
      ];
    }
    if (useCaseId === "collections") {
      const paid = Math.round(config.outstandingAmount * (config.settlementPercentage / 100));
      return [
        ["Amount Paid", formatCurrencyFull(paid)],
        ["Status", "Settled"],
        ["Transaction ID", "TXN" + Date.now().toString().slice(-8)],
      ];
    }
    return [];
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Animated success gradient */}
      <div
        className={`flex-1 flex flex-col items-center justify-center px-6 gap-6 transition-all duration-700 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Animated checkmark */}
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: bank.bgLight }}
          >
            <svg
              className={`w-12 h-12 transition-all duration-500 delay-300 ${
                show ? "opacity-100" : "opacity-0"
              }`}
              viewBox="0 0 52 52"
              fill="none"
            >
              <circle cx="26" cy="26" r="25" fill={bank.primaryColor} />
              <path
                d="M14 27l8 8 16-16"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-500 delay-500 ${
                  show ? "opacity-100" : "opacity-0"
                }`}
              />
            </svg>
          </div>
          {/* Ripple rings */}
          {show && (
            <>
              <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: bank.primaryColor }}
              />
            </>
          )}
        </div>

        {/* Message */}
        <div className="text-center">
          <p
            className={`font-extrabold text-2xl transition-all duration-500 delay-200 ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ color: bank.primaryColor }}
          >
            {config.successMessage}
          </p>
          <p
            className={`text-gray-400 text-sm mt-2 transition-all duration-500 delay-300 ${
              show ? "opacity-100" : "opacity-0"
            }`}
          >
            A confirmation has been sent to your registered mobile & email
          </p>
        </div>

        {/* Details */}
        <div
          className={`w-full bg-gray-50 rounded-2xl p-4 space-y-3 transition-all duration-500 delay-400 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {getDetails().map(([label, value]) => (
            <div key={label} className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="font-bold text-sm text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Share/Rate */}
        <div className="flex gap-3 w-full">
          <button className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium">
            📥 Download Receipt
          </button>
          <button className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium">
            ⭐ Rate Experience
          </button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-4">
        <button
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
