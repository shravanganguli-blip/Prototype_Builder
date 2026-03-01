"use client";

import { Bank } from "@/lib/banks";
import { PrototypeConfig, formatCurrency } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

const BENEFITS = [
  { icon: "🛡️", title: "Zero Fraud Liability", desc: "Full protection against unauthorised transactions" },
  { icon: "✈️", title: "Lounge Access", desc: "Complimentary airport lounge visits per quarter" },
  { icon: "🎯", title: "Reward Points", desc: "Earn 5X points on dining, travel & online shopping" },
  { icon: "🔄", title: "EMI Conversion", desc: "Convert any purchase above ₹2,500 into easy EMIs" },
  { icon: "📞", title: "24/7 Support", desc: "Dedicated concierge support anytime, anywhere" },
];

export default function BenefitsScreen({ bank, config, onNext }: Props) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Card Benefits</p>
        <p className="text-xs opacity-70 mt-0.5">What you get with your card</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Savings highlight */}
        {config.nudges.savingsMeter && (
          <div
            className="rounded-xl p-4 text-white mb-2"
            style={{
              background: `linear-gradient(135deg, ${bank.primaryColor}cc, ${bank.secondaryColor})`,
            }}
          >
            <p className="text-sm opacity-80">Estimated annual savings</p>
            <p className="text-2xl font-extrabold">
              {formatCurrency(config.nudges.savingsAmount)}
            </p>
            <p className="text-xs opacity-70 mt-1">
              Based on average spending patterns
            </p>
          </div>
        )}

        {/* Benefits list */}
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="flex items-start gap-3 p-3 rounded-xl border border-gray-100"
          >
            <span className="text-2xl flex-shrink-0">{b.icon}</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{b.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{b.desc}</p>
            </div>
          </div>
        ))}
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
