"use client";

import { useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function TransactionSelectScreen({ bank, config, onNext }: Props) {
  const [selected, setSelected] = useState(0);
  const amount = config.transactionAmount;

  const transactions = [
    { merchant: "Amazon India", date: "28 Feb", amount, category: "Shopping" },
    { merchant: "Flipkart", date: "25 Feb", amount: Math.round(amount * 0.6), category: "Shopping" },
    { merchant: "IRCTC", date: "20 Feb", amount: Math.round(amount * 0.3), category: "Travel" },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Select Transaction</p>
        <p className="text-xs opacity-70 mt-0.5">Choose which purchase to convert</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Eligible transactions
        </p>

        {transactions.map((tx, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              selected === i ? "border-indigo-500" : "border-gray-100"
            }`}
            style={
              selected === i
                ? { borderColor: bank.primaryColor, backgroundColor: bank.bgLight }
                : {}
            }
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
              style={{ backgroundColor: bank.primaryColor + "33" }}
            >
              🛍️
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-900 text-sm">{tx.merchant}</p>
                <p className="font-bold text-sm text-gray-900">
                  {formatCurrencyFull(tx.amount)}
                </p>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-gray-400 text-xs">{tx.date}</p>
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                  {tx.category}
                </span>
              </div>
            </div>
            {selected === i && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                style={{ backgroundColor: bank.primaryColor }}
              >
                ✓
              </div>
            )}
          </button>
        ))}

        <div className="bg-blue-50 rounded-xl p-3 mt-2">
          <p className="text-blue-700 text-xs">
            💡 Converting{" "}
            <strong>{formatCurrencyFull(transactions[selected].amount)}</strong>{" "}
            from {transactions[selected].merchant} into easy EMIs
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 pt-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          View EMI Plans →
        </button>
      </div>
    </div>
  );
}
