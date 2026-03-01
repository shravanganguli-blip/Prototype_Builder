"use client";

import { useState } from "react";
import { getBankById } from "@/lib/banks";
import {
  getUseCaseById,
  getScreensForUseCase,
  ScreenId,
  UseCaseId,
} from "@/lib/journeys";
import { SavedPrototype } from "@/lib/types";
import PhoneFrame from "./PhoneFrame";
import WelcomeScreen from "./screens/WelcomeScreen";
import OfferDetailsScreen from "./screens/OfferDetailsScreen";
import BenefitsScreen from "./screens/BenefitsScreen";
import EMICalculatorScreen from "./screens/EMICalculatorScreen";
import TransactionSelectScreen from "./screens/TransactionSelectScreen";
import EMIPlansScreen from "./screens/EMIPlansScreen";
import PaymentSummaryScreen from "./screens/PaymentSummaryScreen";
import PaymentOptionsScreen from "./screens/PaymentOptionsScreen";
import ConfirmScreen from "./screens/ConfirmScreen";
import OTPScreen from "./screens/OTPScreen";
import SetPINScreen from "./screens/SetPINScreen";
import RejectedScreen from "./screens/RejectedScreen";
import SuccessScreen from "./screens/SuccessScreen";

interface Props {
  prototype: SavedPrototype;
}

export default function PrototypeViewer({ prototype }: Props) {
  const bank = getBankById(prototype.bankId);
  const useCase = getUseCaseById(prototype.useCaseId);
  const [currentScreen, setCurrentScreen] = useState(0);

  if (!bank || !useCase) {
    return <div className="p-8 text-red-500">Invalid prototype configuration.</div>;
  }

  const screens = getScreensForUseCase(useCase, prototype.config.showRejectionFlow);
  const totalScreens = screens.length;
  const screenId = screens[currentScreen];

  const goNext = () => {
    if (currentScreen < totalScreens - 1) {
      setCurrentScreen((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentScreen > 0) {
      setCurrentScreen((s) => s - 1);
    }
  };

  const renderScreen = (id: ScreenId) => {
    const { config } = prototype;
    const useCaseId = prototype.useCaseId as UseCaseId;

    switch (id) {
      case "welcome":
        return (
          <WelcomeScreen
            bank={bank}
            useCaseId={useCaseId}
            config={config}
            onNext={goNext}
          />
        );
      case "offer-details":
        return (
          <OfferDetailsScreen
            bank={bank}
            useCaseId={useCaseId}
            config={config}
            onNext={goNext}
          />
        );
      case "benefits":
        return (
          <BenefitsScreen bank={bank} config={config} onNext={goNext} />
        );
      case "emi-calculator":
        return (
          <EMICalculatorScreen bank={bank} config={config} onNext={goNext} />
        );
      case "transaction-select":
        return (
          <TransactionSelectScreen bank={bank} config={config} onNext={goNext} />
        );
      case "emi-plans":
        return (
          <EMIPlansScreen bank={bank} config={config} onNext={goNext} />
        );
      case "payment-summary":
        return (
          <PaymentSummaryScreen bank={bank} config={config} onNext={goNext} />
        );
      case "payment-options":
        return (
          <PaymentOptionsScreen bank={bank} config={config} onNext={goNext} />
        );
      case "confirm":
        return (
          <ConfirmScreen
            bank={bank}
            useCaseId={useCaseId}
            config={config}
            onNext={goNext}
          />
        );
      case "otp":
        return <OTPScreen bank={bank} config={config} onNext={goNext} />;
      case "set-pin":
        return <SetPINScreen bank={bank} onNext={goNext} />;
      case "rejected":
        return <RejectedScreen bank={bank} config={config} onNext={goNext} />;
      case "success":
        return (
          <SuccessScreen bank={bank} useCaseId={useCaseId} config={config} />
        );
      default:
        return <div className="p-8 text-gray-400">Screen not found: {id}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: bank.primaryColor }}
            >
              {bank.logoInitials.slice(0, 2)}
            </div>
            <div>
              <p className="font-bold text-gray-900">{bank.name}</p>
              <p className="text-gray-400 text-xs">{useCase.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Screen picker */}
            <select
              value={currentScreen}
              onChange={(e) => setCurrentScreen(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none focus:border-indigo-400"
            >
              {screens.map((s, i) => (
                <option key={s} value={i}>
                  {i + 1}. {s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>

            {/* Share button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Copy Link
            </button>

            {/* Edit button */}
            <a
              href="/builder"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              + New Prototype
            </a>
          </div>
        </div>
      </div>

      {/* Phone viewer */}
      <div className="max-w-5xl mx-auto flex justify-center">
        <PhoneFrame
          bank={bank}
          currentScreen={currentScreen}
          totalScreens={totalScreens}
          onNext={goNext}
          onPrev={goPrev}
        >
          {renderScreen(screenId)}
        </PhoneFrame>
      </div>
    </div>
  );
}
