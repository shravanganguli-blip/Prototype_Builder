"use client";

import { useState, useRef, useEffect } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig, AuthField, getDefaultAuthFields } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function AuthScreen({ bank, config, onNext }: Props) {
  const resolvedFields: AuthField[] =
    config.authType === "custom" && config.authFields && config.authFields.length > 0
      ? config.authFields
      : getDefaultAuthFields(config.useCaseCategory ?? "cards");

  const [values, setValues] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [toast, setToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isCampaign = config.journeyType === "campaign";

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleFieldChange = (id: string, val: string) => {
    setValues((v) => ({ ...v, [id]: val }));
    setErrors((e) => ({ ...e, [id]: "" }));
    if (id === "otp-trigger") showToast();
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const autoFill = () => {
    const filled: Record<string, string> = {};
    resolvedFields.forEach((f) => {
      if (f.type === "otp") return;
      if (f.id === "mobile") filled[f.id] = "9876543210";
      else if (f.id === "card-last4") filled[f.id] = "1234";
      else if (f.id === "dob-year") filled[f.id] = "1990";
      else filled[f.id] = "demo";
    });
    setValues(filled);
    setOtp(["1", "2", "3", "4", "5", "6"]);
    showToast();
    setTimeout(() => {
      setVerifying(true);
      setTimeout(() => { setVerifying(false); onNext(); }, 1500);
    }, 500);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;
    resolvedFields.forEach((f) => {
      if (f.type === "otp") {
        if (otp.join("").length < 6) { newErrors["otp"] = "Enter the 6-digit OTP"; valid = false; }
        return;
      }
      if (f.required && !values[f.id]?.trim()) {
        newErrors[f.id] = `${f.label} is required`;
        valid = false;
      }
    });
    setErrors(newErrors);
    if (!valid) return;
    setVerifying(true);
    setTimeout(() => { setVerifying(false); onNext(); }, 1500);
  };

  const hasOtp = resolvedFields.some((f) => f.type === "otp");

  // Show OTP toast when OTP field first focuses
  const handleOtpFocus = () => {
    if (!toast && otp.every((d) => !d)) showToast();
  };

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      {/* OTP sent toast */}
      <div className={`absolute top-0 left-0 right-0 z-20 transition-transform duration-300 ${toast ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="mx-3 mt-3 bg-green-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
          <span>✓</span>
          <span>OTP sent to +91 ••••• 43210</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-5 py-4 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})` }}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-white" />
        <p className="text-xs opacity-70 font-medium tracking-wide mb-0.5">STEP 1 OF 2</p>
        <p className="font-extrabold text-base">Quick Verification</p>
        <p className="text-xs opacity-75 mt-0.5">Confirm your identity to continue</p>
      </div>

      {/* Demo mode chip */}
      <div className="absolute top-[72px] right-3 z-10">
        <button
          onClick={autoFill}
          className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full border border-amber-200 shadow-sm"
        >
          ⚡ Demo Fill
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 space-y-4">
        {isCampaign && (
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
            <span className="text-green-600 text-xs">📲</span>
            <p className="text-green-700 text-xs font-medium">Mobile pre-filled from campaign link</p>
          </div>
        )}

        {resolvedFields.map((field) => {
          if (field.type === "otp") {
            return (
              <div key={field.id}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
                {field.hint && <p className="text-xs text-gray-400 mb-2">{field.hint}</p>}
                <div className="flex gap-2 justify-center" onFocus={handleOtpFocus}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-10 h-12 text-center text-lg font-bold rounded-xl border-2 focus:outline-none transition-all ${
                        digit ? "text-indigo-700 bg-indigo-50" : "border-gray-200 bg-gray-50"
                      }`}
                      style={digit ? { borderColor: bank.primaryColor, color: bank.primaryColor } : {}}
                    />
                  ))}
                </div>
                <p className="text-center text-gray-400 text-xs mt-2">
                  Resend OTP in <span className="text-gray-600 font-medium">30s</span>
                </p>
                {errors["otp"] && <p className="text-red-500 text-xs mt-1 text-center">{errors["otp"]}</p>}
              </div>
            );
          }

          const isMobile = field.id === "mobile";
          const isPreFilled = isCampaign && isMobile;

          return (
            <div key={field.id}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
              {field.hint && <p className="text-xs text-gray-400 mb-1">{field.hint}</p>}
              <div className="relative">
                {isMobile && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium border-r border-gray-200 pr-2">+91</span>
                )}
                <input
                  type={field.type === "tel" ? "tel" : field.type === "number" ? "text" : field.type}
                  value={isPreFilled ? "98765 43210" : (values[field.id] ?? "")}
                  readOnly={isPreFilled}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder ?? ""}
                  className={`w-full border-2 rounded-xl px-3 py-3 text-sm focus:outline-none transition-all ${
                    errors[field.id] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white"
                  } ${isMobile ? "pl-14" : ""} ${isPreFilled ? "bg-gray-100 text-gray-500 cursor-default" : ""}`}
                  style={values[field.id] && !errors[field.id] ? { borderColor: bank.primaryColor } : {}}
                />
                {isPreFilled && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">Pre-filled</span>
                )}
              </div>
              {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-5 pb-4 pt-3">
        <button
          onClick={handleSubmit}
          disabled={verifying}
          className="w-full py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ backgroundColor: bank.primaryColor }}
        >
          {verifying ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Verifying...
            </>
          ) : "Verify & Continue →"}
        </button>
        <p className="text-center text-gray-400 text-xs mt-2">
          🔒 256-bit encrypted · Safe with {bank.shortName}
        </p>
      </div>

      {/* Verifying overlay */}
      {verifying && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30 flex-col gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: bank.bgLight }}>
            <svg className="animate-spin h-7 w-7" viewBox="0 0 24 24" fill="none" style={{ color: bank.primaryColor }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700">Verifying your identity…</p>
        </div>
      )}
    </div>
  );
}
