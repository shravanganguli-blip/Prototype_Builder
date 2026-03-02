"use client";

import { useState } from "react";
import {
  USE_CASES,
  UseCaseId,
  UseCaseCategory,
  ScreenId,
  getUseCasesByCategory,
} from "@/lib/journeys";

interface Props {
  selected: UseCaseId | "";
  onChange: (id: UseCaseId) => void;
  otherDescription: string;
  onOtherDescriptionChange: (d: string) => void;
  otherMode: "generic" | "pick";
  onOtherModeChange: (m: "generic" | "pick") => void;
}

const CATEGORIES: { id: UseCaseCategory; label: string; emoji: string }[] = [
  { id: "cards", label: "Cards", emoji: "💳" },
  { id: "loans", label: "Loans", emoji: "💰" },
  { id: "liabilities", label: "Liabilities", emoji: "🏦" },
  { id: "collections", label: "Collections", emoji: "🔔" },
  { id: "other", label: "Other", emoji: "✨" },
];

const PICKABLE_SCREENS: { id: ScreenId; label: string }[] = [
  { id: "campaign-preview", label: "Campaign Preview" },
  { id: "welcome", label: "Welcome" },
  { id: "auth", label: "Auth" },
  { id: "offer-details", label: "Offer Details" },
  { id: "benefits", label: "Benefits" },
  { id: "emi-calculator", label: "EMI Calculator" },
  { id: "confirm", label: "Confirm" },
  { id: "otp", label: "OTP" },
  { id: "set-pin", label: "Set PIN" },
  { id: "success", label: "Success" },
];

export default function UseCaseSelector({
  selected,
  onChange,
  otherDescription,
  onOtherDescriptionChange,
  otherMode,
  onOtherModeChange,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<UseCaseCategory>("cards");
  const [pickedScreens, setPickedScreens] = useState<ScreenId[]>(["welcome", "auth", "offer-details", "success"]);

  const useCases = getUseCasesByCategory(activeCategory);

  function toggleScreen(id: ScreenId) {
    setPickedScreens((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Select Use Case</h2>
      <p className="text-gray-500 text-sm mb-5">
        Pick the customer journey you want to showcase. Use the category tabs to browse all available use cases.
      </p>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none border-b-2 -mb-px ${
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Use case grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {useCases.map((uc) => {
          const isSelected = selected === uc.id;
          return (
            <button
              key={uc.id}
              type="button"
              onClick={() => onChange(uc.id)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all duration-150 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <span className="text-2xl block mb-2">{uc.icon}</span>

              {/* Name */}
              <p
                className={`font-semibold text-sm leading-snug ${
                  isSelected ? "text-indigo-700" : "text-gray-900"
                }`}
              >
                {uc.name}
              </p>

              {/* Description */}
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{uc.description}</p>

              {/* Screen count badge */}
              <div className="mt-3">
                <span className="inline-block text-xs bg-gray-100 text-gray-500 rounded px-2 py-0.5">
                  {uc.screens.length} screen{uc.screens.length !== 1 ? "s" : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* "Other" inline panel — only when Other tab is active and "other" use case is selected */}
      {activeCategory === "other" && selected === "other" && (
        <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 space-y-4">
          <p className="text-sm font-semibold text-indigo-900">
            Describe your use case
          </p>

          {/* Description textarea */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Use case description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={otherDescription}
              onChange={(e) => onOtherDescriptionChange(e.target.value)}
              placeholder="e.g. Loan against FD, BNPL activation, Credit card balance transfer…"
              rows={3}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Flow mode toggle */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Flow mode</p>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 gap-1">
              {(["generic", "pick"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onOtherModeChange(m)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none ${
                    otherMode === m
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {m === "generic" ? "Generic Flow" : "Pick Screens"}
                </button>
              ))}
            </div>
          </div>

          {/* Screen picker — only when "pick" mode */}
          {otherMode === "pick" && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">
                Select screens to include in your journey:
              </p>
              <div className="flex flex-wrap gap-2">
                {PICKABLE_SCREENS.map((s) => {
                  const active = pickedScreens.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleScreen(s.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 focus:outline-none ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              {pickedScreens.length === 0 && (
                <p className="text-xs text-amber-600 mt-2">
                  Select at least one screen.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
