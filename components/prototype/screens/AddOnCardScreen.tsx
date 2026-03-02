"use client";

import { useEffect, useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

const RELATIONS = ["Spouse", "Parent", "Child", "Sibling"];

const BENEFITS = [
  "Same credit limit management",
  "Separate spend controls",
  "Lifetime free add-on",
  "Earn rewards on all spends",
];

export default function AddOnCardScreen({ bank, config, onNext }: Props) {
  const [visible, setVisible] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState("Spouse");
  const cardholderName = config.addOnCardholderName || "Family Member";

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
          <p className="text-white font-bold text-base">Add Family Member</p>
          <p className="text-white text-xs opacity-70">{bank.name}</p>
        </div>
      </div>

      {!visible ? (
        <div className="flex-1 p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div
          className={`flex-1 overflow-y-auto px-5 py-4 space-y-4 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Card visual mockup */}
          <div
            className="w-full rounded-2xl p-5 relative overflow-hidden shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`,
              minHeight: "160px",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 bg-white" />
            <div className="absolute bottom-0 left-1/2 w-56 h-56 rounded-full opacity-5 bg-white -translate-x-1/2" />

            {/* Chip icon */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white text-xs opacity-60 font-medium uppercase tracking-wider">
                  {bank.name}
                </p>
                <p className="text-white text-xs font-semibold mt-0.5 opacity-80">Add-on Card</p>
              </div>
              <div className="w-9 h-6 bg-yellow-400 rounded-md opacity-90 flex items-center justify-center">
                <div className="w-7 h-4 border border-yellow-600 rounded-sm opacity-60" />
              </div>
            </div>

            {/* Card number */}
            <p className="text-white text-base tracking-widest font-mono opacity-80">
              •••• •••• •••• ••••
            </p>

            {/* Cardholder */}
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-white text-xs opacity-50 uppercase">ADD-ON CARDHOLDER</p>
                <p className="text-white font-extrabold text-sm uppercase tracking-wide mt-0.5">
                  {cardholderName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white text-xs opacity-50">VALID THRU</p>
                <p className="text-white font-bold text-sm">12/28</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-700 font-semibold text-sm mb-3">
              Share with {cardholderName}
            </p>
            <div className="space-y-2">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: bank.primaryColor }}
                  >
                    ✓
                  </div>
                  <p className="text-gray-700 text-sm">{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              Cardholder Details
            </p>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">
                Add-on Cardholder Name
              </label>
              <div
                className="w-full border-2 rounded-xl px-4 py-3 text-gray-900 font-semibold text-sm bg-gray-50 focus-within:bg-white transition-colors"
                style={{ borderColor: bank.primaryColor }}
              >
                {cardholderName}
              </div>
            </div>

            {/* Relation selector */}
            <div>
              <label className="text-gray-500 text-xs mb-2 block">Relation</label>
              <div className="flex gap-2 flex-wrap">
                {RELATIONS.map((r) => {
                  const isActive = selectedRelation === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRelation(r)}
                      className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                      style={{
                        borderColor: isActive ? bank.primaryColor : "#E5E7EB",
                        backgroundColor: isActive ? bank.bgLight : "#FFFFFF",
                        color: isActive ? bank.primaryColor : "#6B7280",
                      }}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lifetime free badge */}
          <div
            className="flex items-center gap-3 rounded-xl p-3 border"
            style={{ backgroundColor: bank.bgLight, borderColor: bank.primaryColor + "40" }}
          >
            <span className="text-lg">🎁</span>
            <div>
              <p className="font-bold text-sm" style={{ color: bank.primaryColor }}>
                Lifetime Free Add-on Card
              </p>
              <p className="text-gray-500 text-xs">No annual fee · No joining fee</p>
            </div>
          </div>
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
          Instant issuance · Shared benefits
        </p>
      </div>
    </div>
  );
}
