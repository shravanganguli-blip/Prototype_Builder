"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SavedPrototype } from "@/lib/types";
import { BANKS } from "@/lib/banks";
import { USE_CASES } from "@/lib/journeys";

export default function LibraryClient() {
  const [prototypes, setPrototypes] = useState<SavedPrototype[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBank, setFilterBank] = useState("");
  const [filterUseCase, setFilterUseCase] = useState("");

  const fetchPrototypes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterBank) params.set("bank", filterBank);
      if (filterUseCase) params.set("useCase", filterUseCase);
      const res = await fetch(`/api/prototypes?${params.toString()}`);
      const data = await res.json();
      setPrototypes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchPrototypes, 200);
    return () => clearTimeout(t);
  }, [search, filterBank, filterUseCase]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prototype?")) return;
    await fetch(`/api/prototypes/${id}`, { method: "DELETE" });
    setPrototypes((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-gray-900">Prototype Library</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              All saved journey prototypes
            </p>
          </div>
          <Link
            href="/builder"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            + New Prototype
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by bank, use case or customer name..."
            className="input flex-1 min-w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input w-44"
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
          >
            <option value="">All Banks</option>
            {BANKS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.shortName}
              </option>
            ))}
          </select>
          <select
            className="input w-52"
            value={filterUseCase}
            onChange={(e) => setFilterUseCase(e.target.value)}
          >
            <option value="">All Use Cases</option>
            {USE_CASES.map((uc) => (
              <option key={uc.id} value={uc.id}>
                {uc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-indigo-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : prototypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 font-medium">No prototypes found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || filterBank || filterUseCase
                ? "Try adjusting your filters"
                : "Create your first prototype to get started"}
            </p>
            <Link
              href="/builder"
              className="inline-block mt-5 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700"
            >
              Create Prototype
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {prototypes.map((p) => (
              <PrototypeCard key={p.id} prototype={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PrototypeCard({
  prototype: p,
  onDelete,
}: {
  prototype: SavedPrototype;
  onDelete: (id: string) => void;
}) {
  const bank = BANKS.find((b) => b.id === p.bankId);
  const useCase = USE_CASES.find((u) => u.id === p.useCaseId);
  const date = new Date(p.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Card header with bank color */}
      <div
        className="px-5 py-4 relative overflow-hidden"
        style={{
          background: bank
            ? `linear-gradient(135deg, ${bank.primaryColor}, ${bank.secondaryColor})`
            : "#4F46E5",
        }}
      >
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 bg-white" />
        <div className="flex items-start justify-between">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            {bank?.logoInitials.slice(0, 2) ?? "?"}
          </div>
          <span className="text-white text-2xl">{useCase?.icon ?? "📱"}</span>
        </div>
        <p className="text-white font-bold mt-3 text-sm">{p.bankName}</p>
        <p className="text-white text-opacity-70 text-xs mt-0.5 opacity-70">
          {p.useCaseName}
        </p>
      </div>

      {/* Card body */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span>For {p.config.customerName}</span>
          <span>{date}</span>
        </div>

        {/* Nudge tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.config.nudges.preApprovedBadge && (
            <Tag color="green">Pre-approved</Tag>
          )}
          {p.config.nudges.scarcityTimer && (
            <Tag color="amber">Timer</Tag>
          )}
          {p.config.nudges.socialProof && (
            <Tag color="blue">Social proof</Tag>
          )}
          {p.config.showRejectionFlow && (
            <Tag color="orange">Rejection flow</Tag>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/prototype/${p.id}`}
            className="flex-1 text-center py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: bank?.primaryColor ?? "#4F46E5" }}
          >
            View Demo
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/prototype/${p.id}`
              );
              alert("Link copied!");
            }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 text-xs transition-colors"
            title="Copy share link"
          >
            🔗
          </button>
          <button
            onClick={() => onDelete(p.id)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 text-xs transition-colors"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}

function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorMap[color] ?? "bg-gray-100 text-gray-600"}`}>
      {children}
    </span>
  );
}
