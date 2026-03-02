"use client";

interface Props {
  selected: "organic" | "campaign" | "";
  onChange: (type: "organic" | "campaign") => void;
  campaignChannel: "sms" | "whatsapp" | "email" | "rcs";
  onChannelChange: (ch: "sms" | "whatsapp" | "email" | "rcs") => void;
}

const CHANNELS: {
  id: "sms" | "whatsapp" | "email" | "rcs";
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "sms",
    label: "SMS",
    color: "#2563EB",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#16A34A",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    color: "#7C3AED",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
  },
  {
    id: "rcs",
    label: "RCS",
    color: "#0891B2",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    ),
  },
];

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function JourneyTypeSelector({
  selected,
  onChange,
  campaignChannel,
  onChannelChange,
}: Props) {
  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Journey Type</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Choose how your customer enters this prototype journey — directly via the app or via a
          triggered campaign message.
        </p>
      </div>

      {/* Two large cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ── Organic ─────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => onChange("organic")}
          className={`relative rounded-2xl border-2 p-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group ${
            selected === "organic"
              ? "border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100"
              : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"
          }`}
        >
          {/* Selected badge */}
          {selected === "organic" && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-100 rounded-full px-2 py-0.5">
              <CheckIcon /> Selected
            </span>
          )}

          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors ${
              selected === "organic" ? "bg-indigo-100" : "bg-gray-100 group-hover:bg-indigo-50"
            }`}
          >
            🌱
          </div>

          {/* Title */}
          <p
            className={`font-bold text-base mb-2 ${
              selected === "organic" ? "text-indigo-700" : "text-gray-900"
            }`}
          >
            Organic Journey
          </p>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            User discovers the journey via app, net banking, or WhatsApp. Starts with a landing
            page.
          </p>

          {/* Flow pill */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
              selected === "organic"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="text-[10px]">▶</span>
            Landing → Auth → Offer → Confirm
          </div>
        </button>

        {/* ── Campaign ────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => onChange("campaign")}
          className={`relative rounded-2xl border-2 p-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group ${
            selected === "campaign"
              ? "border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100"
              : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"
          }`}
        >
          {/* Selected badge */}
          {selected === "campaign" && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-100 rounded-full px-2 py-0.5">
              <CheckIcon /> Selected
            </span>
          )}

          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors ${
              selected === "campaign" ? "bg-indigo-100" : "bg-gray-100 group-hover:bg-indigo-50"
            }`}
          >
            📣
          </div>

          {/* Title */}
          <p
            className={`font-bold text-base mb-2 ${
              selected === "campaign" ? "text-indigo-700" : "text-gray-900"
            }`}
          >
            Campaign Based
          </p>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Triggered via SMS, WhatsApp, Email, or RCS. First screen shows the message preview
            with a deeplink.
          </p>

          {/* Flow pill */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
              selected === "campaign"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="text-[10px]">▶</span>
            Message Preview → Landing → Auth → Offer
          </div>
        </button>
      </div>

      {/* ── Channel selector — only when Campaign selected ───────────── */}
      {selected === "campaign" && (
        <div className="mt-5 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-50/50 p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-indigo-900">Campaign Channel</p>
          </div>
          <p className="text-xs text-indigo-600 mb-4 ml-7">
            Select the channel through which your campaign message will be delivered to customers.
          </p>

          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((ch) => {
              const isActive = campaignChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onChannelChange(ch.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? "text-white" : ""
                    }`}
                    style={{ color: isActive ? "white" : ch.color }}
                  >
                    {ch.icon}
                  </span>
                  {ch.label}
                  {isActive && (
                    <span className="ml-0.5">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Channel description */}
          <div className="mt-4 pt-4 border-t border-indigo-100">
            {campaignChannel === "sms" && (
              <p className="text-xs text-indigo-700">
                <span className="font-semibold">SMS:</span> A short text message with a deeplink
                is sent to the customer. The prototype opens a message preview screen first.
              </p>
            )}
            {campaignChannel === "whatsapp" && (
              <p className="text-xs text-indigo-700">
                <span className="font-semibold">WhatsApp:</span> A rich WhatsApp Business message
                with CTA button is sent. The prototype shows the chat bubble UI as the first
                screen.
              </p>
            )}
            {campaignChannel === "email" && (
              <p className="text-xs text-indigo-700">
                <span className="font-semibold">Email:</span> An HTML email with an offer banner
                and CTA is sent. The prototype renders an email preview as the first screen.
              </p>
            )}
            {campaignChannel === "rcs" && (
              <p className="text-xs text-indigo-700">
                <span className="font-semibold">RCS:</span> A rich card message via RCS (Google
                Messages) with images and action buttons. Preview shows the interactive card UI.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Helper note when nothing selected */}
      {selected === "" && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
          <span className="text-amber-500 flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <p className="text-xs text-amber-700 font-medium">
            Please select a journey type above to continue.
          </p>
        </div>
      )}
    </div>
  );
}
