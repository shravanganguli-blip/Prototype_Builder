"use client";

import { useState } from "react";
import { BANKS, Bank } from "@/lib/banks";
import { CustomBankColors } from "@/lib/journeys";

interface Props {
  selected: string;
  onChange: (bankId: string) => void;
  customBankName: string;
  onCustomNameChange: (name: string) => void;
  customBankColors: CustomBankColors | null;
  onCustomColorsChange: (colors: CustomBankColors | null) => void;
}

export default function BankSelector({
  selected,
  onChange,
  customBankName,
  onCustomNameChange,
  customBankColors,
  onCustomColorsChange,
}: Props) {
  const [urlInput, setUrlInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");

  const handleExtractColors = async () => {
    if (!urlInput.trim()) return;
    setExtracting(true);
    setExtractError("");
    onCustomColorsChange(null);
    try {
      const res = await fetch(
        `/api/extract-theme?url=${encodeURIComponent(urlInput.trim())}`
      );
      const data = await res.json();
      if (data.found) {
        onCustomColorsChange({
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          accentColor: data.accentColor,
          bgLight: data.bgLight,
        });
      } else {
        setExtractError("No theme color found. You can still proceed with a default theme.");
      }
    } catch {
      setExtractError("Could not reach the URL. Proceeding with default theme.");
    } finally {
      setExtracting(false);
    }
  };

  const previewColor = customBankColors?.primaryColor ?? "#4B5563";

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Select Bank / NBFC</h2>
      <p className="text-gray-500 text-sm mb-6">
        Choose the institution you are demoing for. Brand colours will be applied automatically.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {BANKS.map((bank) =>
          bank.id === "other" ? (
            <OtherCard
              key="other"
              selected={selected === "other"}
              onClick={() => onChange("other")}
            />
          ) : (
            <BankCard
              key={bank.id}
              bank={bank}
              selected={selected === bank.id}
              onClick={() => onChange(bank.id)}
            />
          )
        )}
      </div>

      {/* Other — inline config panel */}
      {selected === "other" && (
        <div className="mt-6 p-5 rounded-2xl border-2 border-indigo-200 bg-indigo-50 space-y-4">
          <p className="text-sm font-semibold text-indigo-800">Configure your institution</p>

          {/* Name input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bank / NBFC Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customBankName}
              onChange={(e) => onCustomNameChange(e.target.value)}
              placeholder="e.g. Tata Capital, ICICI Bank…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white"
            />
          </div>

          {/* URL input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Website URL{" "}
              <span className="text-gray-400 font-normal">(optional — auto-picks brand colour)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExtractColors()}
                placeholder="e.g. tatacapital.com"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white"
              />
              <button
                onClick={handleExtractColors}
                disabled={extracting || !urlInput.trim()}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {extracting ? "Fetching…" : "Extract Colours"}
              </button>
            </div>
            {extractError && (
              <p className="text-xs text-amber-600 mt-1">{extractError}</p>
            )}
          </div>

          {/* Color preview */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
              style={{ backgroundColor: previewColor }}
            >
              {customBankName ? customBankName.slice(0, 2).toUpperCase() : "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {customBankName || "Your institution"}
              </p>
              <p className="text-xs text-gray-400">
                {customBankColors
                  ? `Brand colour picked: ${customBankColors.primaryColor}`
                  : "Default grey theme — enter URL above to auto-pick colours"}
              </p>
            </div>
            {customBankColors && (
              <button
                onClick={() => { onCustomColorsChange(null); setUrlInput(""); setExtractError(""); }}
                className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Reset colour
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BankCard({
  bank,
  selected,
  onClick,
}: {
  bank: Bank;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
        selected
          ? "border-indigo-600 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-3"
        style={{ backgroundColor: bank.primaryColor }}
      >
        {bank.logoInitials}
      </div>
      <p className="font-semibold text-gray-900 text-sm leading-tight">{bank.shortName}</p>
      <p className="text-gray-400 text-xs mt-0.5 truncate">{bank.name}</p>
    </button>
  );
}

function OtherCard({ selected, onClick }: { selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${
        selected
          ? "border-indigo-600 shadow-md bg-indigo-50"
          : "border-dashed border-gray-300 hover:border-indigo-400 bg-gray-50"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-200 text-gray-500 text-xl mb-3">
        +
      </div>
      <p className="font-semibold text-gray-700 text-sm leading-tight">Other</p>
      <p className="text-gray-400 text-xs mt-0.5">Enter manually</p>
    </button>
  );
}
