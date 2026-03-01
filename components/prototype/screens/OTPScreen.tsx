"use client";

import { useState, useEffect, useRef } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function OTPScreen({ bank, config, onNext }: Props) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();

    // Auto verify when all 6 digits entered
    const filled = newOtp.join("");
    if (filled.length === 6) {
      setTimeout(() => {
        setStatus("verifying");
        setTimeout(() => {
          setStatus("success");
          setTimeout(onNext, 800);
        }, 3000);
      }, 200);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const prefill = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
    setStatus("verifying");
    setTimeout(() => {
      setStatus("success");
      setTimeout(onNext, 800);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">OTP Verification</p>
        <p className="text-xs opacity-70 mt-0.5">Secure your transaction</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ backgroundColor: bank.bgLight }}
        >
          📱
        </div>

        <div className="text-center">
          <p className="font-bold text-gray-900 text-base">Enter OTP</p>
          <p className="text-gray-400 text-sm mt-1">
            6-digit OTP sent to{" "}
            <span className="font-medium text-gray-600">+91 ••••••7834</span>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={status !== "idle"}
              className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-colors ${
                status === "success"
                  ? "bg-green-50 border-green-400 text-green-700"
                  : digit
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-gray-50"
              }`}
              style={
                digit && status === "idle"
                  ? { borderColor: bank.primaryColor, color: bank.primaryColor }
                  : {}
              }
            />
          ))}
        </div>

        {/* Status */}
        {status === "idle" && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-400 text-xs">
              Demo OTP:{" "}
              <button
                onClick={prefill}
                className="font-bold underline"
                style={{ color: bank.primaryColor }}
              >
                tap to auto-fill
              </button>
            </p>
            <p className="text-gray-400 text-xs">
              Resend OTP in <span className="font-medium text-gray-600">30s</span>
            </p>
          </div>
        )}
        {status === "verifying" && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Verifying...
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
            <span className="text-lg">✅</span> Verified!
          </div>
        )}
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-green-500 text-sm">🔒</span>
          <p className="text-gray-400 text-xs">
            Your OTP is confidential. {bank.shortName} will never ask for it.
          </p>
        </div>
      </div>
    </div>
  );
}
