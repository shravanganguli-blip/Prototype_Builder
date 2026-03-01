"use client";

import { useState } from "react";
import { Bank } from "@/lib/banks";

interface Props {
  bank: Bank;
  onNext: () => void;
}

export default function SetPINScreen({ bank, onNext }: Props) {
  const [pin, setPin] = useState<string[]>(Array(4).fill(""));
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(4).fill(""));
  const [step, setStep] = useState<"set" | "confirm">("set");

  const handleDigit = (digit: string) => {
    if (step === "set") {
      const next = [...pin];
      const idx = next.findIndex((d) => d === "");
      if (idx === -1) return;
      next[idx] = digit;
      setPin(next);
      if (next.every((d) => d !== "")) {
        setTimeout(() => setStep("confirm"), 400);
      }
    } else {
      const next = [...confirmPin];
      const idx = next.findIndex((d) => d === "");
      if (idx === -1) return;
      next[idx] = digit;
      setConfirmPin(next);
      if (next.every((d) => d !== "")) {
        setTimeout(onNext, 800);
      }
    }
  };

  const handleBackspace = () => {
    if (step === "set") {
      const next = [...pin];
      const idx = next.map((d, i) => (d !== "" ? i : -1)).filter((i) => i >= 0).pop();
      if (idx !== undefined) next[idx] = "";
      setPin(next);
    } else {
      const next = [...confirmPin];
      const idx = next.map((d, i) => (d !== "" ? i : -1)).filter((i) => i >= 0).pop();
      if (idx !== undefined) next[idx] = "";
      setConfirmPin(next);
    }
  };

  const current = step === "set" ? pin : confirmPin;

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">
          {step === "set" ? "Set Card PIN" : "Confirm PIN"}
        </p>
        <p className="text-xs opacity-70 mt-0.5">Choose a 4-digit PIN for your card</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        {/* PIN dots */}
        <div className="flex gap-5">
          {current.map((d, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                d ? "border-transparent" : "border-gray-300"
              }`}
              style={d ? { backgroundColor: bank.primaryColor } : {}}
            />
          ))}
        </div>

        <p className="text-gray-400 text-sm">
          {step === "set" ? "Enter 4-digit PIN" : "Re-enter PIN to confirm"}
        </p>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-64">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
            (key) => (
              <button
                key={key}
                onClick={() =>
                  key === "⌫" ? handleBackspace() : key && handleDigit(key)
                }
                className={`h-14 rounded-2xl text-xl font-semibold transition-all active:scale-95 ${
                  key === ""
                    ? "invisible"
                    : key === "⌫"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {key}
              </button>
            )
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-center text-gray-400 text-xs">
          🔐 Your PIN is encrypted and never stored
        </p>
      </div>
    </div>
  );
}
