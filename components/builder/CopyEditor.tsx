"use client";

import { PrototypeConfig } from "@/lib/journeys";

interface Props {
  config: PrototypeConfig;
  onChange: (updates: Partial<PrototypeConfig>) => void;
}

export default function CopyEditor({ config, onChange }: Props) {
  const handle =
    (field: keyof PrototypeConfig) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ [field]: e.target.value });
    };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Edit Copy</h2>
      <p className="text-gray-500 text-sm mb-6">
        Customise the headline, subheadline, call-to-action, and success message shown in the prototype.
      </p>

      <div className="space-y-5">
        <Field
          label="Welcome Headline"
          hint="Main message on the welcome / offer screen"
        >
          <input
            type="text"
            className="input"
            value={config.headline}
            onChange={handle("headline")}
          />
        </Field>

        <Field
          label="Sub-headline"
          hint="Supporting line below the headline"
        >
          <input
            type="text"
            className="input"
            value={config.subheadline}
            onChange={handle("subheadline")}
          />
        </Field>

        <Field
          label="Primary CTA Button Text"
          hint="Text on the main action button"
        >
          <input
            type="text"
            className="input"
            value={config.ctaText}
            onChange={handle("ctaText")}
          />
        </Field>

        <Field
          label="Success Message"
          hint="Message shown on the final success screen"
        >
          <input
            type="text"
            className="input"
            value={config.successMessage}
            onChange={handle("successMessage")}
          />
        </Field>
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
