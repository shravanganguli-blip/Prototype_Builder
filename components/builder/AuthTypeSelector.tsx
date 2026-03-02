"use client";

import { useState } from "react";
import {
  UseCaseCategory,
  AuthField,
  AuthFieldType,
  MaskRule,
  DEFAULT_CARD_AUTH_FIELDS,
  DEFAULT_LOAN_AUTH_FIELDS,
  getDefaultAuthFields,
} from "@/lib/journeys";

interface Props {
  useCaseCategory: UseCaseCategory;
  authType: "default" | "custom";
  authFields: AuthField[];
  onAuthTypeChange: (t: "default" | "custom") => void;
  onFieldsChange: (fields: AuthField[]) => void;
}

const FIELD_TYPES: { value: AuthFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "tel", label: "Phone" },
  { value: "number", label: "Number" },
  { value: "password", label: "Password" },
  { value: "date", label: "Date" },
  { value: "otp", label: "OTP" },
];

const MASK_RULES: { value: MaskRule; label: string }[] = [
  { value: "none", label: "None (show all)" },
  { value: "partial", label: "Partial (first 2 + last 2)" },
  { value: "full", label: "Full (all hidden)" },
];

const FIELD_TYPE_COLORS: Record<AuthFieldType, string> = {
  text: "bg-blue-100 text-blue-700",
  tel: "bg-green-100 text-green-700",
  number: "bg-amber-100 text-amber-700",
  password: "bg-red-100 text-red-700",
  date: "bg-purple-100 text-purple-700",
  otp: "bg-indigo-100 text-indigo-700",
};

const emptyAddForm = {
  label: "",
  type: "text" as AuthFieldType,
  mask: "none" as MaskRule,
  required: true,
  placeholder: "",
  hint: "",
};

function generateId(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Math.random().toString(36).slice(2, 6);
}

// ─── Phone Preview ────────────────────────────────────────────────────────────

function PhonePreview({ fields }: { fields: AuthField[] }) {
  return (
    <div className="flex flex-col items-center">
      {/* Phone frame */}
      <div className="relative rounded-3xl border-8 border-gray-800 bg-white shadow-2xl w-56 overflow-hidden" style={{ height: "24rem" }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />

        {/* Screen content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header strip */}
          <div className="pt-5 pb-3 px-4" style={{ background: "#4F46E5" }}>
            <p className="text-white text-xs font-bold mt-1 text-center">Quick Verification</p>
            <p className="text-indigo-200 text-[10px] text-center mt-0.5">Please confirm your identity</p>
          </div>

          {/* Fields */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50">
            {fields.map((field) => (
              <div key={field.id}>
                <p className="text-[9px] font-semibold text-gray-600 mb-0.5">{field.label}</p>
                {field.type === "otp" ? (
                  <div className="flex gap-1 justify-center mt-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 w-5 border-2 rounded text-center text-[9px] bg-white border-gray-300"
                      />
                    ))}
                  </div>
                ) : field.type === "tel" ? (
                  <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2 py-1">
                    <svg className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-[9px] text-gray-400">{field.placeholder || "+91 XXXXXXXXXX"}</span>
                  </div>
                ) : field.type === "password" ? (
                  <div className="bg-white border border-gray-200 rounded px-2 py-1">
                    <span className="text-[9px] text-gray-400 tracking-widest">••••••••</span>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded px-2 py-1">
                    <span className="text-[9px] text-gray-400">{field.placeholder || field.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-3 py-3 bg-white border-t border-gray-100">
            <button
              className="w-full py-1.5 rounded-lg text-white text-[10px] font-bold"
              style={{ background: "#4F46E5" }}
            >
              Verify &amp; Continue
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400 text-center">Live preview</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuthTypeSelector({
  useCaseCategory,
  authType,
  authFields,
  onAuthTypeChange,
  onFieldsChange,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(emptyAddForm);

  const defaultFields = getDefaultAuthFields(useCaseCategory);
  const previewFields = authType === "default" ? defaultFields : authFields;

  // ── Add field ────────────────────────────────────────────────────────────────

  function handleAddField() {
    if (!addForm.label.trim()) return;
    const newField: AuthField = {
      id: generateId(addForm.label),
      label: addForm.label.trim(),
      type: addForm.type,
      mask: addForm.mask,
      required: addForm.required,
      placeholder: addForm.placeholder || undefined,
      hint: addForm.hint || undefined,
    };
    onFieldsChange([...authFields, newField]);
    setAddForm(emptyAddForm);
    setShowAddForm(false);
  }

  function handleRemoveField(id: string) {
    if (authFields.length <= 1) return;
    onFieldsChange(authFields.filter((f) => f.id !== id));
  }

  function handleToggleRequired(id: string) {
    onFieldsChange(
      authFields.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
    );
  }

  // ── Switching modes ──────────────────────────────────────────────────────────

  function handleAuthTypeChange(t: "default" | "custom") {
    onAuthTypeChange(t);
    // Seed custom fields from defaults when switching to custom for the first time
    if (t === "custom" && authFields.length === 0) {
      onFieldsChange([...defaultFields]);
    }
  }

  // ── Which default description to show ────────────────────────────────────────

  const isCardCategory = useCaseCategory === "cards";
  const defaultDesc = isCardCategory
    ? "Cards default: Mobile + Card Last 4 + OTP"
    : "Loans / Collections / Liabilities default: Mobile + Year of Birth + OTP";

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Authentication Setup</h2>
      <p className="text-gray-500 text-sm mb-6">
        Configure how customers verify their identity before accessing their offer.
      </p>

      {/* Side-by-side layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Toggle pills */}
          <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 mb-5">
            {(["default", "custom"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleAuthTypeChange(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 focus:outline-none ${
                  authType === t
                    ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "default" ? "Default" : "Custom"}
              </button>
            ))}
          </div>

          {/* ── DEFAULT MODE ─────────────────────────────────────────────────── */}
          {authType === "default" && (
            <div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-4 flex gap-3">
                <span className="text-lg flex-shrink-0">🔒</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Default auth is automatically set based on use case category
                  </p>
                  <p className="text-xs text-amber-700 mt-1">{defaultDesc}</p>
                </div>
              </div>

              <div className="space-y-2">
                {defaultFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
                  >
                    {/* Lock icon */}
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700">{field.label}</p>
                      {field.hint && (
                        <p className="text-xs text-gray-400 truncate">{field.hint}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${FIELD_TYPE_COLORS[field.type]}`}>
                      {field.type.toUpperCase()}
                    </span>
                    {field.required && (
                      <span className="text-xs text-red-500 font-medium">Required</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CUSTOM MODE ──────────────────────────────────────────────────── */}
          {authType === "custom" && (
            <div>
              {authFields.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400 mb-4">
                  No fields yet. Add at least one field below.
                </div>
              )}

              {/* Field list */}
              <div className="space-y-2 mb-4">
                {authFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 group"
                  >
                    {/* Drag handle (visual only) */}
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                    </svg>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{field.label}</p>
                      {field.hint && (
                        <p className="text-xs text-gray-400 truncate">{field.hint}</p>
                      )}
                    </div>

                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${FIELD_TYPE_COLORS[field.type]}`}>
                      {field.type.toUpperCase()}
                    </span>

                    {/* Required toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleRequired(field.id)}
                      className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border transition-colors ${
                        field.required
                          ? "border-red-200 text-red-600 bg-red-50"
                          : "border-gray-200 text-gray-400 bg-gray-50"
                      }`}
                      title="Toggle required"
                    >
                      {field.required ? "Req" : "Opt"}
                    </button>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveField(field.id)}
                      disabled={authFields.length <= 1}
                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove field"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Field inline form */}
              {showAddForm ? (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 space-y-3">
                  <p className="text-sm font-semibold text-indigo-800 mb-2">New Field</p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Label *</label>
                    <input
                      type="text"
                      value={addForm.label}
                      onChange={(e) => setAddForm({ ...addForm, label: e.target.value })}
                      placeholder="e.g. Date of Birth"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                      <select
                        value={addForm.type}
                        onChange={(e) => setAddForm({ ...addForm, type: e.target.value as AuthFieldType })}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {FIELD_TYPES.map((ft) => (
                          <option key={ft.value} value={ft.value}>{ft.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Mask</label>
                      <select
                        value={addForm.mask}
                        onChange={(e) => setAddForm({ ...addForm, mask: e.target.value as MaskRule })}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {MASK_RULES.map((mr) => (
                          <option key={mr.value} value={mr.value}>{mr.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Placeholder (optional)</label>
                    <input
                      type="text"
                      value={addForm.placeholder}
                      onChange={(e) => setAddForm({ ...addForm, placeholder: e.target.value })}
                      placeholder="e.g. DD/MM/YYYY"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Hint (optional)</label>
                    <input
                      type="text"
                      value={addForm.hint}
                      onChange={(e) => setAddForm({ ...addForm, hint: e.target.value })}
                      placeholder="Helper text shown below field"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="add-required"
                      type="checkbox"
                      checked={addForm.required}
                      onChange={(e) => setAddForm({ ...addForm, required: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="add-required" className="text-sm text-gray-700">Required field</label>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAddField}
                      disabled={!addForm.label.trim()}
                      className="flex-1 rounded-lg bg-indigo-600 text-white text-sm font-semibold py-2 hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add Field
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setAddForm(emptyAddForm); }}
                      className="px-4 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium py-2 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all w-full px-4 py-3 text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Field
                </button>
              )}

              {authFields.length <= 1 && (
                <p className="text-xs text-amber-600 mt-2">
                  Minimum 1 field is required.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL — Phone preview ──────────────────────────────────── */}
        <div className="w-full lg:w-64 flex-shrink-0 flex justify-center lg:justify-start">
          <PhonePreview fields={previewFields} />
        </div>
      </div>
    </div>
  );
}
