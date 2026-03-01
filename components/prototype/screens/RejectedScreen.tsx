"use client";

import { Bank } from "@/lib/banks";
import { PrototypeConfig } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function RejectedScreen({ bank, config, onNext }: Props) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Application Status</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
        {/* Icon */}
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl">
          ⚠️
        </div>

        <div>
          <p className="font-extrabold text-gray-900 text-xl">
            Not Eligible Right Now
          </p>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Based on your current profile, {config.customerName}, we are unable
            to process this request at this time.
          </p>
        </div>

        {/* Reasons */}
        <div className="w-full bg-orange-50 border border-orange-100 rounded-2xl p-4 text-left space-y-2">
          <p className="text-orange-700 text-xs font-bold uppercase tracking-wide">
            Possible reasons
          </p>
          {[
            "Credit score below required threshold",
            "Recent missed payments on record",
            "High credit utilisation ratio",
          ].map((reason) => (
            <div key={reason} className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">•</span>
              <p className="text-orange-700 text-xs">{reason}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs">
          You may re-apply after 90 days or once your credit profile improves.
        </p>
      </div>

      <div className="px-5 pb-4 space-y-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Check Eligibility Again →
        </button>
        <button className="w-full py-3 text-gray-400 text-sm">
          Return to Home
        </button>
      </div>
    </div>
  );
}
