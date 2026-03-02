"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrency, formatCurrencyFull } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

const WHY_ITEMS = [
  { icon: "⚡", title: "Instant Disbursal", sub: "Money in your account within minutes" },
  { icon: "📄", title: "Zero Paperwork", sub: "No documents, no visits, no hassle" },
  { icon: "🔒", title: "Fully Secure", sub: "Bank-grade encryption & RBI regulated" },
];

export default function LOCOfferScreen({ bank, config, onNext }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 flex items-center gap-3"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <button className="text-white opacity-80 text-xl leading-none">&#8592;</button>
        <div>
          <p className="text-white font-bold text-base">Loan on Card</p>
          <p className="text-white text-xs opacity-70">{bank.name}</p>
        </div>
        {config.nudges.preApprovedBadge && (
          <div className="ml-auto bg-green-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-700 rounded-full animate-pulse" />
            PRE-APPROVED
          </div>
        )}
      </div>

      {!visible ? (
        <div className="flex-1 p-5 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          className={`flex-1 overflow-y-auto px-5 py-4 space-y-4 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Offer amount pill */}
          <div
            className="rounded-2xl p-6 text-center relative overflow-hidden shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`,
            }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 bg-white" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-10 bg-white" />
            <p className="text-white text-xs opacity-70 font-medium uppercase tracking-wider mb-1">
              Pre-Approved Loan Amount
            </p>
            <p className="text-white text-5xl font-extrabold">
              {formatCurrency(config.loanAmount)}
            </p>
            <p className="text-white text-sm opacity-60 mt-1">
              {formatCurrencyFull(config.loanAmount)}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-white text-xs font-semibold">Ready for Instant Disbursal</p>
            </div>
          </div>

          {/* Key details */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Loan Details
            </p>
            <div className="space-y-0 divide-y divide-gray-50">
              <div className="flex justify-between items-center py-2.5">
                <p className="text-gray-500 text-sm">Interest Rate</p>
                <p className="font-extrabold text-sm" style={{ color: bank.primaryColor }}>
                  {config.interestRate}% p.a.
                </p>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <p className="text-gray-500 text-sm">Tenure</p>
                <p className="font-bold text-gray-900 text-sm">
                  Up to {config.tenure} months
                </p>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <p className="text-gray-500 text-sm">Disbursal</p>
                <p className="font-bold text-sm text-green-600">Instant to your account</p>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <p className="text-gray-500 text-sm">Processing Fee</p>
                <p className="font-bold text-gray-900 text-sm">&#8377;0</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-gray-400 text-xs font-medium">Why choose this loan?</p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Why section */}
          <div className="space-y-2">
            {WHY_ITEMS.map(({ icon, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: bank.bgLight }}
                >
                  {icon}
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">{title}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scarcity */}
          {config.nudges.scarcityTimer && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span className="text-lg">&#9201;</span>
              <div>
                <p className="text-amber-800 text-xs font-bold">Offer expires soon</p>
                <p className="text-amber-900 font-extrabold text-sm">
                  {config.nudges.scarcityHours} hours remaining
                </p>
              </div>
            </div>
          )}
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
          Instant disbursal · No hidden charges
        </p>
      </div>
    </div>
  );
}
