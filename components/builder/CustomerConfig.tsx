"use client";

import { PrototypeConfig, UseCaseId, calculateEMI } from "@/lib/journeys";

interface Props {
  useCaseId: UseCaseId;
  config: PrototypeConfig;
  onChange: (updates: Partial<PrototypeConfig>) => void;
}

// ─── EMI-bearing use cases ────────────────────────────────────────────────────

const EMI_USE_CASES_LOAN_AMOUNT: UseCaseId[] = [
  "loan-on-card",
  "personal-loan-on-card",
  "loan-personal",
];

const NO_EXTRA_CONFIG_CASES: UseCaseId[] = [
  "pin-set",
  "card-controls",
  "dormancy-consent",
];

export default function CustomerConfig({ useCaseId, config, onChange }: Props) {
  // Generic field change with optional EMI recalc
  const handleChange =
    (field: keyof PrototypeConfig) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      const updates: Partial<PrototypeConfig> = { [field]: val };

      // Auto-recalculate EMI for loan-amount-based use cases
      if (EMI_USE_CASES_LOAN_AMOUNT.includes(useCaseId)) {
        if (["loanAmount", "interestRate", "tenure"].includes(field)) {
          const la = field === "loanAmount" ? Number(val) : config.loanAmount;
          const ir = field === "interestRate" ? Number(val) : config.interestRate;
          const te = field === "tenure" ? Number(val) : config.tenure;
          updates.emi = calculateEMI(la, ir, te);
        }
      }

      // Legacy personal-loan EMI recalc
      if (useCaseId === "personal-loan") {
        if (["loanAmount", "interestRate", "tenure"].includes(field)) {
          const la = field === "loanAmount" ? Number(val) : config.loanAmount;
          const ir = field === "interestRate" ? Number(val) : config.interestRate;
          const te = field === "tenure" ? Number(val) : config.tenure;
          updates.emi = calculateEMI(la, ir, te);
        }
      }

      // loan-topup EMI recalc (uses topUpAmount)
      if (useCaseId === "loan-topup") {
        if (["topUpAmount", "interestRate", "tenure"].includes(field)) {
          const ta = field === "topUpAmount" ? Number(val) : (config.topUpAmount ?? 0);
          const ir = field === "interestRate" ? Number(val) : config.interestRate;
          const te = field === "tenure" ? Number(val) : config.tenure;
          updates.emi = calculateEMI(ta, ir, te);
        }
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
        {/* Customer Name — always shown */}
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

        {/* ── LEGACY: Credit Card ──────────────────────────────────────────── */}
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

        {/* ── LEGACY: Personal Loan ────────────────────────────────────────── */}
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
            <EMIDisplay emi={config.emi} />
          </>
        )}

        {/* ── LEGACY: EMI Conversion (also handles transaction-to-emi) ─────── */}
        {(useCaseId === "emi-conversion" || useCaseId === "transaction-to-emi") && (
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

        {/* ── LEGACY: Collections ───────────────────────────────────────────── */}
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

        {/* ── Outstanding to EMI ────────────────────────────────────────────── */}
        {useCaseId === "outstanding-to-emi" && (
          <>
            <Field label="Outstanding Amount (₹)" hint="Total card outstanding balance to convert">
              <input
                type="number"
                value={config.outstandingAmount}
                onChange={handleChange("outstandingAmount")}
                className="input"
                step={1000}
                min={1000}
              />
            </Field>
            <Field label="Annual Interest Rate (%)" hint="Interest rate for EMI conversion">
              <input
                type="number"
                value={config.interestRate}
                onChange={handleChange("interestRate")}
                className="input"
                step={0.1}
                min={0}
              />
            </Field>
            <Field label="Tenure (months)" hint="EMI repayment duration">
              <input
                type="number"
                value={config.tenure}
                onChange={handleChange("tenure")}
                className="input"
                step={3}
                min={3}
                max={36}
              />
            </Field>
          </>
        )}

        {/* ── Credit Limit Increase ─────────────────────────────────────────── */}
        {useCaseId === "credit-limit-increase" && (
          <>
            <Field label="Current Credit Limit (₹)" hint="Customer's existing credit limit">
              <input
                type="number"
                value={config.currentCreditLimit ?? ""}
                onChange={handleChange("currentCreditLimit")}
                className="input"
                step={10000}
                min={10000}
              />
            </Field>
            <Field label="New Credit Limit (₹)" hint="Upgraded credit limit being offered">
              <input
                type="number"
                value={config.newCreditLimit ?? ""}
                onChange={handleChange("newCreditLimit")}
                className="input"
                step={10000}
                min={10000}
              />
            </Field>
          </>
        )}

        {/* ── Loan on Card / Personal Loan on Card ─────────────────────────── */}
        {(useCaseId === "loan-on-card" || useCaseId === "personal-loan-on-card") && (
          <>
            <Field label="Loan Amount (₹)" hint="Loan amount offered against card limit">
              <input
                type="number"
                value={config.loanAmount}
                onChange={handleChange("loanAmount")}
                className="input"
                step={25000}
                min={25000}
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
                max={60}
              />
            </Field>
            <EMIDisplay emi={config.emi} />
          </>
        )}

        {/* ── Add-on Card ───────────────────────────────────────────────────── */}
        {useCaseId === "addon-card" && (
          <Field label="Add-on Cardholder Name" hint="Name of the family member receiving the add-on card">
            <input
              type="text"
              value={config.addOnCardholderName ?? ""}
              onChange={handleChange("addOnCardholderName")}
              className="input"
              placeholder="e.g. Priya"
            />
          </Field>
        )}

        {/* ── Card Upgrade ──────────────────────────────────────────────────── */}
        {useCaseId === "card-upgrade" && (
          <>
            <SelectField
              label="Current Card Tier"
              hint="Customer's existing card variant"
              value={config.cardTier ?? "Gold"}
              onChange={(v) => onChange({ cardTier: v })}
              options={[
                { value: "Classic", label: "Classic" },
                { value: "Gold", label: "Gold" },
                { value: "Platinum", label: "Platinum" },
              ]}
            />
            <SelectField
              label="Upgrade Card Tier"
              hint="The premium variant being offered"
              value={config.upgradeCardTier ?? "Platinum"}
              onChange={(v) => onChange({ upgradeCardTier: v })}
              options={[
                { value: "Gold", label: "Gold" },
                { value: "Platinum", label: "Platinum" },
                { value: "Signature", label: "Signature" },
                { value: "Infinite", label: "Infinite" },
              ]}
            />
          </>
        )}

        {/* ── Card Activation RBI 37-Day ────────────────────────────────────── */}
        {useCaseId === "card-activation-rbi" && (
          <>
            <Field label="Credit Limit (₹)" hint="Pre-approved credit limit shown during activation">
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

        {/* ── No-config cases: PIN Set, Card Controls, Dormancy Consent ───── */}
        {NO_EXTRA_CONFIG_CASES.includes(useCaseId) && (
          <NoConfigMessage />
        )}

        {/* ── Spend Activation / Spend Increase ────────────────────────────── */}
        {(useCaseId === "spend-activation" || useCaseId === "spend-increase") && (
          <>
            <Field label="Current Spend Limit (₹)" hint="Customer's current monthly spend limit">
              <input
                type="number"
                value={config.currentSpendLimit ?? ""}
                onChange={handleChange("currentSpendLimit")}
                className="input"
                step={5000}
                min={0}
              />
            </Field>
            {useCaseId === "spend-increase" && (
              <Field label="New Spend Limit (₹)" hint="Increased monthly spend limit being offered">
                <input
                  type="number"
                  value={config.newSpendLimit ?? ""}
                  onChange={handleChange("newSpendLimit")}
                  className="input"
                  step={5000}
                  min={5000}
                />
              </Field>
            )}
          </>
        )}

        {/* ── Dormancy Reactivation ─────────────────────────────────────────── */}
        {useCaseId === "dormancy-reactivation" && (
          <Field
            label="Dormancy Period (days)"
            hint="Number of days the card has been inactive"
          >
            <input
              type="number"
              value={config.dormancyDays ?? ""}
              onChange={handleChange("dormancyDays")}
              className="input"
              step={30}
              min={30}
            />
          </Field>
        )}

        {/* ── Personal Loan (new) ───────────────────────────────────────────── */}
        {useCaseId === "loan-personal" && (
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
            <EMIDisplay emi={config.emi} />
          </>
        )}

        {/* ── Top-up Loan ───────────────────────────────────────────────────── */}
        {useCaseId === "loan-topup" && (
          <>
            <Field label="Existing Loan Amount (₹)" hint="Outstanding principal on the current loan">
              <input
                type="number"
                value={config.existingLoanAmount ?? ""}
                onChange={handleChange("existingLoanAmount")}
                className="input"
                step={50000}
                min={50000}
              />
            </Field>
            <Field label="Top-up Amount (₹)" hint="Additional loan amount being offered">
              <input
                type="number"
                value={config.topUpAmount ?? ""}
                onChange={handleChange("topUpAmount")}
                className="input"
                step={25000}
                min={25000}
              />
            </Field>
            <Field label="Annual Interest Rate (%)" hint="Per annum interest rate for the top-up">
              <input
                type="number"
                value={config.interestRate}
                onChange={handleChange("interestRate")}
                className="input"
                step={0.1}
                min={1}
              />
            </Field>
            <Field label="Tenure (months)" hint="Repayment duration for top-up loan">
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
            <EMIDisplay emi={config.emi} />
          </>
        )}

        {/* ── Savings Account Opening ───────────────────────────────────────── */}
        {useCaseId === "savings-account" && (
          <>
            <SelectField
              label="Account Type"
              hint="Type of account being opened"
              value={config.accountType ?? "savings"}
              onChange={(v) => onChange({ accountType: v as "savings" | "salary" | "current" })}
              options={[
                { value: "savings", label: "Savings Account" },
                { value: "salary", label: "Salary Account" },
                { value: "current", label: "Current Account" },
              ]}
            />
            <Field label="Minimum Balance (₹)" hint="Required minimum balance (0 for zero-balance)">
              <input
                type="number"
                value={config.minimumBalance ?? 0}
                onChange={handleChange("minimumBalance")}
                className="input"
                step={1000}
                min={0}
              />
            </Field>
            <Field label="Interest Rate (% p.a.)" hint="Annual interest rate offered on savings">
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

        {/* ── FD Opening ────────────────────────────────────────────────────── */}
        {useCaseId === "fd-opening" && (
          <>
            <Field label="FD Amount (₹)" hint="Principal amount for the fixed deposit">
              <input
                type="number"
                value={config.fdAmount ?? ""}
                onChange={handleChange("fdAmount")}
                className="input"
                step={10000}
                min={1000}
              />
            </Field>
            <Field label="FD Tenor (months)" hint="Duration of the fixed deposit">
              <input
                type="number"
                value={config.fdTenor ?? ""}
                onChange={handleChange("fdTenor")}
                className="input"
                step={1}
                min={1}
                max={120}
              />
            </Field>
            <Field label="FD Interest Rate (% p.a.)" hint="Annual interest rate for the FD">
              <input
                type="number"
                value={config.fdRate ?? ""}
                onChange={handleChange("fdRate")}
                className="input"
                step={0.1}
                min={0}
              />
            </Field>
            <SelectField
              label="Interest Payout"
              hint="How interest is credited to the customer"
              value={config.fdInterestPayout ?? "cumulative"}
              onChange={(v) =>
                onChange({ fdInterestPayout: v as "cumulative" | "monthly" | "quarterly" })
              }
              options={[
                { value: "cumulative", label: "Cumulative (at maturity)" },
                { value: "monthly", label: "Monthly" },
                { value: "quarterly", label: "Quarterly" },
              ]}
            />
          </>
        )}

        {/* ── Payment Journey ───────────────────────────────────────────────── */}
        {useCaseId === "payment-journey" && (
          <Field label="Outstanding Amount (₹)" hint="Total dues the customer needs to clear">
            <input
              type="number"
              value={config.outstandingAmount}
              onChange={handleChange("outstandingAmount")}
              className="input"
              step={1000}
              min={500}
            />
          </Field>
        )}

        {/* ── Settlement Offer (new) ────────────────────────────────────────── */}
        {useCaseId === "settlement-offer" && (
          <>
            <Field label="Outstanding Amount (₹)" hint="Total outstanding dues before settlement">
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

        {/* ── Other / Custom ────────────────────────────────────────────────── */}
        {useCaseId === "other" && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 flex gap-3">
            <span className="text-xl flex-shrink-0">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Custom use case
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Your use case description was set in the previous step. No additional numeric configuration is required for a custom journey.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

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

// ─── Select helper ────────────────────────────────────────────────────────────

function SelectField({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── EMI display box ──────────────────────────────────────────────────────────

function EMIDisplay({ emi }: { emi: number }) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
      <p className="text-sm text-indigo-600 font-medium">Calculated Monthly EMI</p>
      <p className="text-2xl font-bold text-indigo-700 mt-1">
        ₹{emi.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

// ─── No-config message ────────────────────────────────────────────────────────

function NoConfigMessage() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex gap-3">
      <span className="text-xl flex-shrink-0">✅</span>
      <div>
        <p className="text-sm font-semibold text-gray-700">
          No additional configuration needed
        </p>
        <p className="text-xs text-gray-500 mt-1">
          This use case does not require any numeric offer parameters. The journey
          will be built from the selected screens and customer name above.
        </p>
      </div>
    </div>
  );
}
