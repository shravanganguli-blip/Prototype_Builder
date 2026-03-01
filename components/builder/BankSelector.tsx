"use client";

import { BANKS, Bank } from "@/lib/banks";

interface Props {
  selected: string;
  onChange: (bankId: string) => void;
}

export default function BankSelector({ selected, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Select Bank</h2>
      <p className="text-gray-500 text-sm mb-6">
        Choose the bank you are demoing for. Brand colours and logo will be applied automatically.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {BANKS.map((bank) => (
          <BankCard
            key={bank.id}
            bank={bank}
            selected={selected === bank.id}
            onClick={() => onChange(bank.id)}
          />
        ))}
      </div>
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
      {/* Bank logo swatch */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs mb-3"
        style={{ backgroundColor: bank.primaryColor }}
      >
        {bank.logoInitials}
      </div>
      <p className="font-semibold text-gray-900 text-sm leading-tight">
        {bank.shortName}
      </p>
      <p className="text-gray-400 text-xs mt-0.5 truncate">{bank.name}</p>
    </button>
  );
}
