"use client";

import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function PaymentSummaryScreen({ bank, config, onNext }: Props) {
  const outstanding = config.outstandingAmount;
  const lateFee = Math.round(outstanding * 0.02);
  const interest = Math.round(outstanding * (config.interestRate / 100));
  const total = outstanding + lateFee + interest;
  const settlement = Math.round(total * (config.settlementPercentage / 100));

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Payment Summary</p>
        <p className="text-xs opacity-70 mt-0.5">Outstanding dues breakdown</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Total due highlight */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-red-600 text-xs font-medium">Total Outstanding</p>
          <p className="text-red-700 text-3xl font-extrabold mt-1">
            {formatCurrencyFull(total)}
          </p>
          <p className="text-red-400 text-xs mt-1">Including fees & interest</p>
        </div>

        {/* Breakdown */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <Row label="Principal Outstanding" value={formatCurrencyFull(outstanding)} />
          <Row label="Late Payment Fee" value={formatCurrencyFull(lateFee)} red />
          <Row label="Accrued Interest" value={formatCurrencyFull(interest)} red />
          <div className="border-t border-gray-200 pt-3">
            <Row label="Total Payable" value={formatCurrencyFull(total)} bold />
          </div>
        </div>

        {/* Settlement offer */}
        <div
          className="rounded-xl p-4 border-2"
          style={{ borderColor: bank.primaryColor, backgroundColor: bank.bgLight }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">🤝</span>
            <p className="font-bold text-sm" style={{ color: bank.primaryColor }}>
              One-time Settlement Offer
            </p>
          </div>
          <p className="text-gray-600 text-xs">
            Pay just{" "}
            <strong style={{ color: bank.primaryColor }}>
              {formatCurrencyFull(settlement)}
            </strong>{" "}
            now and clear all your dues. Save{" "}
            <strong className="text-green-600">{formatCurrencyFull(total - settlement)}</strong>.
          </p>
          {config.nudges.scarcityTimer && (
            <p className="text-amber-600 text-xs font-bold mt-2">
              ⏰ Offer valid for {config.nudges.scarcityHours}h only
            </p>
          )}
        </div>
      </div>

      <div className="px-5 pb-4 pt-2 space-y-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Pay {formatCurrencyFull(settlement)} →
        </button>
        <button
          onClick={onNext}
          className="w-full py-3 rounded-2xl border border-gray-300 text-gray-600 font-semibold text-sm"
        >
          Pay Full Amount ({formatCurrencyFull(total)})
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  red,
}: {
  label: string;
  value: string;
  bold?: boolean;
  red?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <p className={`text-xs ${bold ? "font-bold text-gray-800" : "text-gray-500"}`}>
        {label}
      </p>
      <p
        className={`text-xs font-semibold ${
          red ? "text-red-500" : bold ? "font-bold text-gray-900" : "text-gray-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
