"use client";

import { useState } from "react";
import { Bank } from "@/lib/banks";
import { PrototypeConfig } from "@/lib/journeys";

interface Props {
  bank: Bank;
  config: PrototypeConfig;
  onNext: () => void;
}

type Channel = "sms" | "whatsapp" | "email" | "rcs";

const CHANNEL_LABELS: Record<Channel, string> = {
  sms: "SMS",
  whatsapp: "WhatsApp",
  email: "Email",
  rcs: "RCS",
};

const SHORT_CODE = "xK9mR2";

function getOfferText(config: PrototypeConfig): string {
  const cat = config.useCaseCategory ?? "cards";
  if (cat === "loans") return "pre-approved loan up to ₹5L";
  if (cat === "liabilities") return "exclusive savings offer";
  if (cat === "collections") return "special settlement plan";
  return "exclusive credit offer";
}

// ─── SMS Preview ──────────────────────────────────────────────────────────────

function SMSPreview({ bank, config }: { bank: Bank; config: PrototypeConfig }) {
  const senderName = bank.name.toUpperCase().replace(/\s+/g, "-").slice(0, 12);
  const offer = getOfferText(config);
  const url = `myzone.${bank.id}.com/${SHORT_CODE}`;
  const message = `Hi ${config.customerName}! Your ${offer} is ready. Tap to activate: ${url}`;
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="bg-gray-100 rounded-2xl overflow-hidden">
      {/* iMessage-style header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mb-1">
          <span className="text-gray-600 text-xs font-bold">{bank.logoInitials.slice(0, 2)}</span>
        </div>
        <p className="text-xs font-semibold text-gray-800">{senderName}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">Today {time}</p>
      </div>

      {/* Messages area */}
      <div className="px-4 py-5 min-h-[160px]">
        {/* Date pill */}
        <div className="flex justify-center mb-4">
          <span className="text-[10px] text-gray-500 bg-gray-200 px-3 py-0.5 rounded-full">Today</span>
        </div>

        {/* Message bubble – left / gray (incoming) */}
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="bg-white rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
            <p className="text-[13px] text-gray-800 leading-snug">
              <span className="font-bold text-gray-900">[{senderName}]:</span>{" "}
              {message}
            </p>
            <p className="text-[10px] text-blue-500 mt-1 font-medium break-all">{url}</p>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 ml-1">{time}</p>
      </div>

      {/* iOS-style "Tap to open" */}
      <div className="bg-white border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <p className="text-[11px] text-gray-400">iMessage</p>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500" style={{ fontSize: 8 }}>▶</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WhatsApp Preview ─────────────────────────────────────────────────────────

function WhatsAppPreview({ bank, config }: { bank: Bank; config: PrototypeConfig }) {
  const offer = getOfferText(config);
  const url = `myzone.${bank.id}.com/offer`;
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200">
      {/* WhatsApp header */}
      <div className="px-3 py-2.5 flex items-center gap-2.5" style={{ backgroundColor: "#075E54" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: bank.primaryColor }}>
          {bank.logoInitials.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-white text-sm font-semibold truncate">{bank.name}</p>
            {/* Verified badge */}
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="#25D366">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.58L18 8.5l-8 8z"/>
            </svg>
          </div>
          <p className="text-green-300 text-[10px]">Business Account · Verified</p>
        </div>
        {/* WA icons */}
        <div className="flex items-center gap-2 opacity-80">
          <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
          <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        </div>
      </div>

      {/* Chat area */}
      <div className="px-3 py-4 min-h-[180px]" style={{ backgroundColor: "#ECE5DD", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
        {/* Date */}
        <div className="flex justify-center mb-3">
          <span className="text-[10px] text-gray-500 bg-white bg-opacity-70 px-3 py-0.5 rounded-full shadow-sm">Today</span>
        </div>

        {/* Bubble from business (left) */}
        <div className="flex gap-2 mb-1">
          <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm px-3.5 py-2.5 max-w-[85%]">
            <p className="text-[11px] font-semibold mb-1" style={{ color: "#075E54" }}>{bank.name}</p>
            <p className="text-[13px] text-gray-800 leading-snug">
              Hi {config.customerName}! You have a {offer} waiting for you. This is a pre-approved offer valid for a limited time only.
            </p>
            <p className="text-[11px] text-blue-500 mt-1.5 font-medium">{url}</p>
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <p className="text-[10px] text-gray-400">{time}</p>
              {/* Blue double tick (read) */}
              <svg className="w-4 h-3" viewBox="0 0 16 11" fill="none">
                <path d="M1 5.5L5.5 10L15 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 5.5L9.5 10L19 1" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(-4, 0)"/>
              </svg>
            </div>
          </div>
        </div>

        {/* WhatsApp template CTA button */}
        <div className="max-w-[85%] mt-1">
          <div className="bg-white rounded-xl shadow-sm border-t border-gray-100 px-3 py-2 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366">
              <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
            <p className="text-[13px] font-semibold" style={{ color: "#128C7E" }}>Open Offer</p>
          </div>
        </div>
      </div>

      {/* Reply bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[12px] text-gray-400">Reply…</div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#25D366" }}>
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── Email Preview ─────────────────────────────────────────────────────────────

function EmailPreview({ bank, config }: { bank: Bank; config: PrototypeConfig }) {
  const offer = getOfferText(config);
  const url = `myzone.${bank.id}.com/offer`;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
      {/* Gmail-like header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-start gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
            style={{ backgroundColor: bank.primaryColor }}>
            {bank.logoInitials.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-900">{bank.name}</p>
              <p className="text-[10px] text-gray-400">10:42 AM</p>
            </div>
            <p className="text-[10px] text-gray-500">noreply@{bank.id}.com</p>
          </div>
        </div>
        <div className="ml-10">
          <p className="text-[11px] text-gray-500">
            <span className="text-gray-400">To:</span> {config.customerName.toLowerCase()}@email.com
          </p>
          <p className="text-[12px] font-semibold text-gray-800 mt-1">
            🎉 {config.customerName}, your exclusive offer is ready — act now!
          </p>
        </div>
      </div>

      {/* Email body */}
      <div className="px-4 py-4 bg-gray-50">
        {/* Bank logo block */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: bank.primaryColor }}>
            {bank.logoInitials}
          </div>
          <span className="text-xs font-bold text-gray-700">{bank.name}</span>
        </div>

        {/* Hero banner */}
        <div
          className="rounded-xl px-4 py-5 mb-4 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})` }}
        >
          <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Exclusive for you</p>
          <p className="text-sm font-extrabold leading-snug">
            Hi {config.customerName},<br />Your {offer} is waiting!
          </p>
          <p className="text-[10px] opacity-75 mt-1.5">Limited time · Pre-approved · No documents needed</p>
        </div>

        <p className="text-[12px] text-gray-600 leading-relaxed mb-4">
          We&apos;re pleased to offer you an exclusive, pre-approved {offer} based on your excellent banking relationship with us. This offer is valid for <strong>48 hours only</strong>.
        </p>

        {/* CTA button */}
        <div className="flex justify-center mb-4">
          <div
            className="px-6 py-2.5 rounded-lg text-white text-[13px] font-bold text-center shadow"
            style={{ backgroundColor: bank.primaryColor }}
          >
            View Your Offer →
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          {url}
        </p>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-3">
        <p className="text-[9px] text-gray-400 text-center leading-relaxed">
          {bank.name} · Registered office: India<br />
          <span className="underline">Unsubscribe</span> · <span className="underline">Privacy Policy</span> · <span className="underline">Terms</span>
        </p>
      </div>
    </div>
  );
}

// ─── RCS Preview ──────────────────────────────────────────────────────────────

function RCSPreview({ bank, config }: { bank: Bank; config: PrototypeConfig }) {
  const offer = getOfferText(config);
  const now = new Date();
  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="bg-gray-100 rounded-2xl overflow-hidden">
      {/* Google Messages header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: bank.primaryColor }}>
          {bank.logoInitials.slice(0, 2)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-gray-900">{bank.name}</p>
            {/* Verified checkmark */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#1A73E8">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.58L18 8.5l-8 8z"/>
            </svg>
          </div>
          <p className="text-[10px] text-blue-600 font-medium">Verified Business</p>
        </div>
        <p className="text-[10px] text-gray-400">{time}</p>
      </div>

      {/* RCS Rich Card */}
      <div className="px-4 py-4">
        {/* Date */}
        <div className="flex justify-center mb-3">
          <span className="text-[10px] text-gray-500 bg-gray-200 px-3 py-0.5 rounded-full">Today</span>
        </div>

        {/* Rich card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-2 max-w-[88%]">
          {/* Card header image / brand color */}
          <div
            className="h-24 relative flex items-end px-3 pb-2.5"
            style={{ background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})` }}
          >
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-white bg-opacity-20 rounded-full px-2 py-0.5">
                <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.58L18 8.5l-8 8z"/></svg>
                <span className="text-white text-[9px] font-medium">Verified</span>
              </div>
            </div>
            <div>
              <p className="text-white text-[9px] font-medium opacity-80 uppercase tracking-widest">
                {bank.name}
              </p>
              <p className="text-white text-[13px] font-bold leading-tight">
                Exclusive Offer for You!
              </p>
            </div>
          </div>

          {/* Card body */}
          <div className="px-3 py-3">
            <p className="text-[12px] text-gray-700 leading-snug mb-2">
              Hi <strong>{config.customerName}</strong>! You have a {offer} pre-approved for you. No paperwork required.
            </p>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5 mb-3">
              <span className="text-[11px]">⏱️</span>
              <p className="text-[10px] text-amber-700 font-semibold">Offer expires in 48 hours</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="border-t border-gray-100 grid grid-cols-2">
            <button
              className="py-2.5 text-[12px] font-semibold border-r border-gray-100 text-center"
              style={{ color: bank.primaryColor }}
            >
              View Offer
            </button>
            <button className="py-2.5 text-[12px] font-semibold text-gray-500 text-center">
              Remind Later
            </button>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 ml-1">{time} · Delivered</p>
      </div>

      {/* Reply bar */}
      <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-[11px] text-gray-400">Text message</div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: bank.primaryColor }}
        >
          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CampaignPreviewScreen({ bank, config, onNext }: Props) {
  const defaultChannel: Channel = config.campaignChannel ?? "sms";
  const [activeTab, setActiveTab] = useState<Channel>(defaultChannel);

  const channels: Channel[] = ["sms", "whatsapp", "email", "rcs"];

  const renderPreview = () => {
    switch (activeTab) {
      case "sms":
        return <SMSPreview bank={bank} config={config} />;
      case "whatsapp":
        return <WhatsAppPreview bank={bank} config={config} />;
      case "email":
        return <EmailPreview bank={bank} config={config} />;
      case "rcs":
        return <RCSPreview bank={bank} config={config} />;
    }
  };

  const channelIcon: Record<Channel, string> = {
    sms: "💬",
    whatsapp: "📱",
    email: "✉️",
    rcs: "🌐",
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: bank.bgLight }}>
      {/* Header */}
      <div
        className="px-5 pt-5 pb-4 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})` }}
      >
        {/* Decorative ring */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: bank.textOnPrimary }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base">📣</span>
            <p className="text-white text-xs font-semibold tracking-wide uppercase opacity-80">Campaign Preview</p>
          </div>
          <p className="text-white text-lg font-extrabold leading-tight">
            How {config.customerName} receives your message
          </p>
          <p className="text-white text-xs opacity-70 mt-1">
            Switch tabs to preview each channel
          </p>
        </div>
      </div>

      {/* Channel Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-3">
        <div className="flex">
          {channels.map((ch) => {
            const isActive = activeTab === ch;
            const isConfigChannel = ch === defaultChannel;
            return (
              <button
                key={ch}
                onClick={() => setActiveTab(ch)}
                className={`flex-1 flex flex-col items-center py-2 gap-0.5 relative transition-all ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-60"
                }`}
              >
                <span className="text-sm">{channelIcon[ch]}</span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: isActive ? bank.primaryColor : "#6B7280" }}
                >
                  {CHANNEL_LABELS[ch]}
                </span>
                {isConfigChannel && (
                  <span
                    className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: bank.accentColor }}
                    title="Configured channel"
                  />
                )}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ backgroundColor: bank.primaryColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {/* Configured badge */}
        {activeTab === defaultChannel && (
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: bank.accentColor }}
            >
              ● Your configured channel
            </span>
          </div>
        )}

        {/* Channel-specific note */}
        <div className="flex items-center gap-1.5 mb-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          <span className="text-xs">💡</span>
          <p className="text-[10px] text-amber-700">
            {activeTab === "sms" && "Standard SMS — works on all phones. No app required."}
            {activeTab === "whatsapp" && "WhatsApp Business API — rich formatting, verified sender."}
            {activeTab === "email" && "Email campaign — full HTML template with bank branding."}
            {activeTab === "rcs" && "RCS — Android rich cards with interactive buttons."}
          </p>
        </div>

        {renderPreview()}
      </div>

      {/* Bottom CTA */}
      <div className="bg-white border-t border-gray-200 px-5 py-4">
        <p className="text-center text-gray-500 text-xs mb-3 font-medium">
          Received this? Continue your application
        </p>
        <button
          onClick={onNext}
          className="w-full py-3.5 rounded-2xl text-sm font-extrabold shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: bank.primaryColor, color: bank.textOnPrimary }}
        >
          Proceed to Verify →
        </button>
        <p className="text-center text-gray-400 text-[10px] mt-2">
          Secure · End-to-end encrypted
        </p>
      </div>
    </div>
  );
}
