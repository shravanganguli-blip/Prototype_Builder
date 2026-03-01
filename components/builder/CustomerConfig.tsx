"use client";

import { PrototypeConfig, UseCaseId, calculateEMI } from "@/lib/journeys";

interface Props {
  useCaseId: UseCaseId;
  config: PrototypeConfig;
  onChange: (updates: Partial<PrototypeConfig>) => void;
}

export default function CustomerConfig({ useCaseId, config, onChange }: Props) {
  const handleChange =
    (field: keyof PrototypeConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      const updates: Partial<PrototypeConfig> = { [field]: val };
      // Auto-recalculate EMI when loan amount, rate or tenure changes
      if (
        ["loanAmount", "interestRate", "tenure"].includes(field) &&
        useCaseId === "personal-loan"
      ) {
        const la = field === "loanAmount" ? Number(val) : config.loanAmount;
        const ir = field === "interestRate" ? Number(val) : config.interestRate;
        const te = field === "tenure" ? Number(val) : config.tenure;
        updates.emi = calculateEMI(la, ir, te);
      }
      onChange(updates);
    };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Configure Offer</h2>
      <p className="text-gray-500 text-sm mb-6">
        AI-suggested defaults have been applied based on bank tier and use case. Adjust as needed.
      </p>

      <div className="space-y-6">
        {/* Customer Name */}
        <Field
          label="Customer First Name"
          hint="Shown on the welcome screen personalisation"
        >
          <input
            type="text"
            value={config.customerName}
            onChange={handleChange("customerName")}
            className="input"
            placeholder="e.g. Rahul"
          />
        </Field>

        {/* Credit Card fields */}
        {useCaseId === "credit-card" && (
          <>
            <Field label="Credit Limit (₹)" hint="Pre-approved credit limit for the card">
              <input
                type="number"
                value={config.creditLimit}
                onChange={handleChange("creditLimit")}
                className="input"
                step={10000}
                min={10000}
              />
            </Field>
            <Field label="Monthly Interest Rate (%)" hint="Annual interest rate / 12">
              <input
                type="number"
                value={config.interestRate}
                onChange={handleChange("interestRate")}
                className="input"
                step={0.1}
                min={0}
              />
            </Field>
          </>
        )}

        {/* Personal Loan fields */}
        {useCaseId === "personal-loan" && (
          <>
            <Field label="Loan Amount (₹)" hint="Pre-approved loan amount">
              <input
                type="number"
                value={config.loanAmount}
                onChange={handleChange("loanAmount")}
                className="input"
                step={50000}
                min={50000}
              />
            </Field>
            <Field label="Annual Interest Rate (%)" hint="Per annum interest rate">
              <input
                type="number"
                value={config.interestRate}
                onChange={handleChange("interestRate")}
                className="input"
                step={0.1}
                min={1}
              />
            </Field>
            <Field label="Tenure (months)" hint="Loan repayment duration">
              <input
                type="number"
                value={config.tenure}
                onChange={handleChange("tenure")}
                className="input"
                step={6}
                min={6}
                max={84}
              />
            </Field>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <p className="text-sm text-indigo-600 font-medium">
                Calculated Monthly EMI
              </p>
              <p className="text-2xl font-bold text-indigo-700 mt-1">
                ₹{config.emi.toLocaleString("en-IN")}
              </p>
            </div>
          </>
        )}

        {/* EMI Conversion fields */}
        {useCaseId === "emi-conversion" && (
          <>
            <Field label="Transaction Amount (₹)" hint="The purchase amount to be converted to EMI">
              <input
                type="number"
                value={config.transactionAmount}
                onChange={handleChange("transactionAmount")}
                className="input"
                step={1000}
                min={1000}
              />
            </Field>
            <Field label="Annual Interest Rate (%)" hint="EMI processing interest rate">
              <input
                type="number"
                value={config.interestRate}
                onChange={handleChange("interestRate")}
                className="input"
                step={0.1}
                min={0}
              />
            </Field>
            <Field label="Preferred Tenure (months)" hint="Default tenure highlighted in the EMI plans">
              <input
                type="number"
                value={config.tenure}
                onChange={handleChange("tenure")}
                className="input"
                step={3}
                min={3}
                max={24}
              />
            </Field>
          </>
        )}

        {/* Collections fields */}
        {useCaseId === "collections" && (
          <>
            <Field label="Outstanding Amount (₹)" hint="Total amount due including overdue">
              <input
                type="number"
                value={config.outstandingAmount}
                onChange={handleChange("outstandingAmount")}
                className="input"
                step={1000}
                min={1000}
              />
            </Field>
            <Field
              label="Settlement Offer (%)"
              hint="Percentage of outstanding accepted for full settlement"
            >
              <input
                type="number"
                value={config.settlementPercentage}
                onChange={handleChange("settlementPercentage")}
                className="input"
                step={5}
                min={50}
                max={100}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      {children}
    </div>
  );
}
