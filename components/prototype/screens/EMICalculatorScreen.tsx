"use client";

import { useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, calculateEMI, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function EMICalculatorScreen({ bank, config, onNext }: Props) {
  const [amount, setAmount] = useState(config.loanAmount);
  const [tenure, setTenure] = useState(config.tenure);

  const emi = calculateEMI(amount, config.interestRate, tenure);
  const totalInterest = emi * tenure - amount;

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">EMI Calculator</p>
        <p className="text-xs opacity-70 mt-0.5">Customise your loan</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* EMI display */}
        <div
          className="rounded-2xl p-5 text-center text-white"
          style={{
            background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`,
          }}
        >
          <p className="text-sm opacity-70">Monthly EMI</p>
          <p className="text-3xl font-extrabold mt-1">{formatCurrencyFull(emi)}</p>
          <p className="text-xs opacity-60 mt-2">
            for {tenure} months at {config.interestRate}% p.a.
          </p>
        </div>

        {/* Amount slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">Loan Amount</p>
            <p className="text-sm font-bold" style={{ color: bank.primaryColor }}>
              {formatCurrencyFull(amount)}
            </p>
          </div>
          <input
            type="range"
            min={50000}
            max={config.loanAmount}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-indigo-600"
            style={{ accentColor: bank.primaryColor }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹50K</span>
            <span>{formatCurrencyFull(config.loanAmount)}</span>
          </div>
        </div>

        {/* Tenure slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">Tenure</p>
            <p className="text-sm font-bold" style={{ color: bank.primaryColor }}>
              {tenure} months
            </p>
          </div>
          <input
            type="range"
            min={6}
            max={84}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: bank.primaryColor }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>6m</span>
            <span>84m</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <Row label="Principal Amount" value={formatCurrencyFull(amount)} />
          <Row label="Total Interest" value={formatCurrencyFull(totalInterest)} />
          <div className="border-t border-gray-200 pt-2 mt-2">
            <Row
              label="Total Payable"
              value={formatCurrencyFull(emi * tenure)}
              bold
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 pt-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Apply for this Loan →
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <p className={`text-xs ${bold ? "font-bold text-gray-800" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`text-xs ${bold ? "font-bold text-gray-900" : "text-gray-700"}`}>
        {value}
      </p>
    </div>
  );
}
