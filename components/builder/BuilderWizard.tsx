"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BANKS, getBankById } from "@/lib/banks";
import {
  USE_CASES,
  UseCaseId,
  PrototypeConfig,
  DEFAULT_CONFIG,
  getUseCaseById,
} from "@/lib/journeys";
import { getSuggestions } from "@/lib/suggestions";
import BankSelector from "./BankSelector";
import UseCaseSelector from "./UseCaseSelector";
import CustomerConfig from "./CustomerConfig";
import NudgesConfig from "./NudgeConfig";
import CopyEditor from "./CopyEditor";

const STEPS = [
  { id: "bank", label: "Bank" },
  { id: "usecase", label: "Use Case" },
  { id: "config", label: "Offer" },
  { id: "nudges", label: "Nudges" },
  { id: "copy", label: "Copy" },
];

export default function BuilderWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [bankId, setBankId] = useState<string>("");
  const [useCaseId, setUseCaseId] = useState<UseCaseId | "">("");
  const [config, setConfig] = useState<PrototypeConfig>({ ...DEFAULT_CONFIG });
  const [saving, setSaving] = useState(false);

  const updateConfig = useCallback((updates: Partial<PrototypeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleBankSelect = (id: string) => {
    setBankId(id);
    if (useCaseId) {
      const suggestions = getSuggestions(id, useCaseId);
      setConfig((prev) => ({ ...prev, ...suggestions }));
    }
  };

  const handleUseCaseSelect = (id: UseCaseId) => {
    setUseCaseId(id);
    const uc = getUseCaseById(id);
    if (uc) {
      const suggestions = bankId
        ? getSuggestions(bankId, id)
        : {};
      setConfig((prev) => ({
        ...prev,
        ...uc.defaultConfig,
        ...suggestions,
      }));
    }
  };

  const canProceed = () => {
    if (step === 0) return bankId !== "";
    if (step === 1) return useCaseId !== "";
    return true;
  };

  const handleGenerate = async () => {
    if (!bankId || !useCaseId) return;
    const bank = getBankById(bankId);
    const uc = getUseCaseById(useCaseId as UseCaseId);
    if (!bank || !uc) return;

    setSaving(true);
    try {
      const res = await fetch("/api/prototypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankId,
          bankName: bank.name,
          useCaseId,
          useCaseName: uc.name,
          config,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();
      router.push(`/prototype/${saved.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate prototype. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top stepper */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 ${
                    i < step ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < step
                        ? "bg-indigo-600 text-white"
                        : i === step
                        ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < step ? (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`text-sm font-medium hidden sm:block ${
                      i === step
                        ? "text-indigo-700"
                        : i < step
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px w-6 sm:w-12 ${
                      i < step ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {step === 0 && (
          <BankSelector selected={bankId} onChange={handleBankSelect} />
        )}
        {step === 1 && (
          <UseCaseSelector
            selected={useCaseId}
            onChange={handleUseCaseSelect}
          />
        )}
        {step === 2 && useCaseId && (
          <CustomerConfig
            useCaseId={useCaseId as UseCaseId}
            config={config}
            onChange={updateConfig}
          />
        )}
        {step === 3 && useCaseId && (
          <NudgesConfig
            useCaseId={useCaseId as UseCaseId}
            nudges={config.nudges}
            showRejectionFlow={config.showRejectionFlow}
            onChange={(nudges) => updateConfig({ nudges })}
            onRejectionChange={(v) => updateConfig({ showRejectionFlow: v })}
          />
        )}
        {step === 4 && (
          <CopyEditor config={config} onChange={updateConfig} />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors ${
              step === 0 ? "invisible" : ""
            }`}
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={saving || !bankId || !useCaseId}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>Generate Prototype</span>
                  <span>→</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
