"use client";

import { useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

const METHODS = [
  { id: "upi", icon: "📱", label: "UPI", sub: "Google Pay, PhonePe, Paytm" },
  { id: "netbanking", icon: "🏦", label: "Net Banking", sub: "All major banks" },
  { id: "card", icon: "💳", label: "Debit Card", sub: "Visa, Mastercard, RuPay" },
];

export default function PaymentOptionsScreen({ bank, config, onNext }: Props) {
  const [selected, setSelected] = useState("upi");
  const payAmount = Math.round(
    config.outstandingAmount * (config.settlementPercentage / 100)
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Choose Payment Method</p>
        <p className="text-xs opacity-70 mt-0.5">
          Paying {formatCurrencyFull(payAmount)}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelected(method.id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all"
            style={
              selected === method.id
                ? { borderColor: bank.primaryColor, backgroundColor: bank.bgLight }
                : { borderColor: "#E5E7EB" }
            }
          >
            <span className="text-2xl">{method.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{method.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{method.sub}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0`}
              style={
                selected === method.id
                  ? { borderColor: bank.primaryColor, backgroundColor: bank.primaryColor }
                  : { borderColor: "#D1D5DB" }
              }
            >
              {selected === method.id && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        ))}

        {/* UPI input */}
        {selected === "upi" && (
          <div className="rounded-xl border border-gray-200 p-4">
            <label className="text-xs text-gray-500 font-medium">UPI ID</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                defaultValue="rahul@okaxis"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                style={{ borderColor: bank.primaryColor + "66" }}
                readOnly
              />
              <span className="text-green-500 font-bold text-sm">✓</span>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center gap-2 justify-center mt-2">
          <span className="text-green-500 text-sm">🔒</span>
          <p className="text-gray-400 text-xs">256-bit SSL encrypted · RBI authorised</p>
        </div>
      </div>

      <div className="px-5 pb-4 pt-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Pay {formatCurrencyFull(payAmount)} →
        </button>
      </div>
    </div>
  );
}
