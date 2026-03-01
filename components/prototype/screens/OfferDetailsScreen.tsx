"use client";

import { Bank } from "@/lib/banks";
import {
  PrototypeConfig,
  UseCaseId,
  formatCurrencyFull,
  calculateEMI,
} from "@/lib/journeys";

interface Props {
  bank: Bank;
  useCaseId: UseCaseId;
  config: PrototypeConfig;
  onNext: () => void;
}

export default function OfferDetailsScreen({ bank, useCaseId, config, onNext }: Props) {
  const emi = config.emi || calculateEMI(config.loanAmount, config.interestRate, config.tenure);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div
        className="px-5 py-4 text-white"
        style={{ backgroundColor: bank.primaryColor }}
      >
        <p className="font-bold text-base">Your Exclusive Offer</p>
        <p className="text-xs opacity-70 mt-0.5">Personalised for you</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Credit Card Offer */}
        {useCaseId === "credit-card" && (
          <>
            {/* Card visual */}
            <div
              className="rounded-2xl p-5 text-white relative overflow-hidden shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`,
              }}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 bg-white" />
              <p className="text-xs opacity-70 font-medium">{bank.name}</p>
              <p className="mt-6 text-lg tracking-widest font-mono">
                •••• •••• •••• 4291
              </p>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-xs opacity-60">CARD HOLDER</p>
                  <p className="font-bold text-sm uppercase">{config.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-60">VALID THRU</p>
                  <p className="font-bold text-sm">12/28</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <DetailRow
              bank={bank}
              label="Credit Limit"
              value={formatCurrencyFull(config.creditLimit)}
              highlight
            />
            <DetailRow
              bank={bank}
              label="Annual Fee"
              value="₹0 (Waived)"
              sub="First year free"
            />
            <DetailRow
              bank={bank}
              label="Rewards Rate"
              value="5% cashback"
              sub="On top categories"
            />
            <DetailRow
              bank={bank}
              label="Interest Rate"
              value={`${config.interestRate}% p.m.`}
            />
          </>
        )}

        {/* Personal Loan Offer */}
        {useCaseId === "personal-loan" && (
          <>
            <DetailRow
              bank={bank}
              label="Pre-approved Amount"
              value={formatCurrencyFull(config.loanAmount)}
              highlight
            />
            <DetailRow
              bank={bank}
              label="Interest Rate"
              value={`${config.interestRate}% p.a.`}
            />
            <DetailRow
              bank={bank}
              label="Tenure"
              value={`${config.tenure} months`}
            />
            <DetailRow
              bank={bank}
              label="Monthly EMI"
              value={formatCurrencyFull(emi)}
              highlight
            />
            <DetailRow
              bank={bank}
              label="Processing Fee"
              value="₹0"
              sub="Zero processing fee — limited offer"
            />
            <DetailRow
              bank={bank}
              label="Disbursal"
              value="Within 24 hours"
              sub="Directly to your account"
            />
          </>
        )}
      </div>

      <div className="px-5 pb-4 pt-2">
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl text-white font-extrabold text-base"
          style={{ backgroundColor: bank.primaryColor }}
        >
          Proceed →
        </button>
      </div>
    </div>
  );
}

function DetailRow({
  bank,
  label,
  value,
  sub,
  highlight,
}: {
  bank: Bank;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded-xl ${
        highlight ? "border" : "border border-gray-100"
      }`}
      style={
        highlight
          ? { borderColor: bank.primaryColor, backgroundColor: bank.bgLight }
          : {}
      }
    >
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
      <p
        className={`font-extrabold text-sm ${
          highlight ? "" : "text-gray-800"
        }`}
        style={highlight ? { color: bank.primaryColor } : {}}
      >
        {value}
      </p>
    </div>
  );
}
