"use client";

import { USE_CASES, UseCaseId } from "@/lib/journeys";

interface Props {
  selected: UseCaseId | "";
  onChange: (id: UseCaseId) => void;
}

export default function UseCaseSelector({ selected, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Select Use Case</h2>
      <p className="text-gray-500 text-sm mb-6">
        Pick the customer journey you want to showcase to the bank.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            onClick={() => onChange(uc.id)}
            className={`rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
              selected === uc.id
                ? "border-indigo-600 bg-indigo-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{uc.icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-base ${
                    selected === uc.id ? "text-indigo-700" : "text-gray-900"
                  }`}
                >
                  {uc.name}
                </p>
                <p className="text-gray-500 text-sm mt-1">{uc.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {uc.screens.map((screen) => (
                    <span
                      key={screen}
                      className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full capitalize"
                    >
                      {screen.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
