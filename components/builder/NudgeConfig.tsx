"use client";

import { NudgeConfig, UseCaseId } from "@/lib/journeys";

interface Props {
  useCaseId: UseCaseId;
  nudges: NudgeConfig;
  showRejectionFlow: boolean;
  onChange: (nudges: NudgeConfig) => void;
  onRejectionChange: (val: boolean) => void;
}

export default function NudgesConfig({
  useCaseId,
  nudges,
  showRejectionFlow,
  onChange,
  onRejectionChange,
}: Props) {
  const update = (field: keyof NudgeConfig) => (val: boolean | number) => {
    onChange({ ...nudges, [field]: val });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Behavioural Nudges & Options
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        AI-suggested nudges based on the use case are pre-selected. Toggle any on or off.
      </p>

      <div className="space-y-4">
        {/* Pre-approved Badge */}
        {useCaseId !== "collections" && (
          <NudgeToggle
            label="Pre-Approved Badge"
            description="Shows a green 'Pre-Approved' badge on the welcome and offer screens"
            enabled={nudges.preApprovedBadge}
            onChange={(v) => update("preApprovedBadge")(v)}
          />
        )}

        {/* Scarcity Timer */}
        <NudgeToggle
          label="Scarcity Timer"
          description="Countdown showing when the offer expires to create urgency"
          enabled={nudges.scarcityTimer}
          onChange={(v) => update("scarcityTimer")(v)}
        >
          {nudges.scarcityTimer && (
            <div className="mt-3 flex items-center gap-3">
              <label className="text-xs text-gray-500">Expires in (hours)</label>
              <input
                type="number"
                className="input w-24 py-1 text-sm"
                value={nudges.scarcityHours}
                min={1}
                max={168}
                onChange={(e) => update("scarcityHours")(Number(e.target.value))}
              />
            </div>
          )}
        </NudgeToggle>

        {/* Social Proof */}
        {useCaseId !== "collections" && (
          <NudgeToggle
            label="Social Proof Counter"
            description="Shows how many other customers have already activated/accepted"
            enabled={nudges.socialProof}
            onChange={(v) => update("socialProof")(v)}
          >
            {nudges.socialProof && (
              <div className="mt-3 flex items-center gap-3">
                <label className="text-xs text-gray-500">Count</label>
                <input
                  type="number"
                  className="input w-32 py-1 text-sm"
                  value={nudges.socialProofCount}
                  step={1000}
                  min={100}
                  onChange={(e) =>
                    update("socialProofCount")(Number(e.target.value))
                  }
                />
              </div>
            )}
          </NudgeToggle>
        )}

        {/* Savings Meter */}
        {useCaseId !== "collections" && (
          <NudgeToggle
            label="Savings Meter"
            description="Highlights how much the customer will save with this offer"
            enabled={nudges.savingsMeter}
            onChange={(v) => update("savingsMeter")(v)}
          >
            {nudges.savingsMeter && (
              <div className="mt-3 flex items-center gap-3">
                <label className="text-xs text-gray-500">Savings amount (₹)</label>
                <input
                  type="number"
                  className="input w-36 py-1 text-sm"
                  value={nudges.savingsAmount}
                  step={1000}
                  min={0}
                  onChange={(e) =>
                    update("savingsAmount")(Number(e.target.value))
                  }
                />
              </div>
            )}
          </NudgeToggle>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Journey Options
          </h3>
          <NudgeToggle
            label="Include Rejection Flow"
            description="Adds an 'Ineligible' screen before OTP to show how edge cases are handled"
            enabled={showRejectionFlow}
            onChange={onRejectionChange}
          />
        </div>
      </div>
    </div>
  );
}

function NudgeToggle({
  label,
  description,
  enabled,
  onChange,
  children,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all ${
        enabled ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p
            className={`font-semibold text-sm ${
              enabled ? "text-indigo-800" : "text-gray-700"
            }`}
          >
            {label}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">{description}</p>
        </div>
        <button
          onClick={() => onChange(!enabled)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            enabled ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {children}
    </div>
  );
}
