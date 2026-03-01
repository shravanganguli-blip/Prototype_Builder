"use client";

import { Bank } from "@/lib/banks";

interface Props {
  bank: Bank;
  children: React.ReactNode;
  currentScreen: number;
  totalScreens: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function PhoneFrame({
  bank,
  children,
  currentScreen,
  totalScreens,
  onNext,
  onPrev,
}: Props) {
  const progress = ((currentScreen + 1) / totalScreens) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          Screen {currentScreen + 1} of {totalScreens}
        </span>
        <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phone shell */}
      <div
        className="relative"
        style={{ width: 375, height: 812 }}
      >
        {/* Outer bezel */}
        <div
          className="absolute inset-0 rounded-[48px] shadow-2xl"
          style={{ backgroundColor: "#1a1a1a" }}
        />
        {/* Screen area */}
        <div
          className="absolute rounded-[40px] overflow-hidden bg-white flex flex-col"
          style={{ inset: "10px" }}
        >
          {/* Status bar */}
          <div
            className="flex items-center justify-between px-6 py-3 text-xs font-semibold flex-shrink-0"
            style={{
              backgroundColor: bank.primaryColor,
              color: bank.textOnPrimary,
            }}
          >
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-4a1 1 0 011-1h2a1 1 0 011 1v13a1 1 0 01-1 1h-2a1 1 0 01-1-1V3z" />
              </svg>
              <svg className="w-3 h-3 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM11 16a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
              <div className="flex items-center gap-0.5">
                <div className="w-4.5 h-2.5 border border-current rounded-sm opacity-80 flex items-center px-0.5">
                  <div className="w-3 h-1.5 bg-current rounded-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* App header with bank branding */}
          <div
            className="flex items-center justify-between px-4 pb-3"
            style={{ backgroundColor: bank.primaryColor, color: bank.textOnPrimary }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                {bank.logoInitials.slice(0, 2)}
              </div>
              <span className="font-semibold text-sm">{bank.shortName}</span>
            </div>
            <button className="text-xs opacity-70">≡</button>
          </div>

          {/* Screen content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>

          {/* Bottom nav bar */}
          <div className="flex border-t border-gray-100 bg-white flex-shrink-0">
            {["Home", "Pay", "Cards", "More"].map((item, i) => (
              <button
                key={item}
                className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${
                  i === 0 ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                <div className="w-4 h-4 bg-current rounded-sm opacity-70" />
                <span className="text-xs">{item}</span>
              </button>
            ))}
          </div>

          {/* Home indicator */}
          <div className="h-6 bg-white flex items-center justify-center">
            <div className="w-24 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Side buttons */}
        <div
          className="absolute left-0 top-24 w-1.5 h-12 rounded-r-sm"
          style={{ backgroundColor: "#333" }}
        />
        <div
          className="absolute left-0 top-40 w-1.5 h-8 rounded-r-sm"
          style={{ backgroundColor: "#333" }}
        />
        <div
          className="absolute right-0 top-32 w-1.5 h-14 rounded-l-sm"
          style={{ backgroundColor: "#333" }}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={currentScreen === 0}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 transition-colors"
        >
          ← Prev
        </button>
        <button
          onClick={onNext}
          disabled={currentScreen === totalScreens - 1}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold disabled:opacity-30 hover:bg-indigo-700 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
