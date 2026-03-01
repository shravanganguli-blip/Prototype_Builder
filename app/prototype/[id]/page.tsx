import { notFound } from "next/navigation";
import { readById } from "@/lib/db";
import PrototypeViewer from "@/components/prototype/PrototypeViewer";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const prototype = readById(id);
  if (!prototype) return { title: "Prototype Not Found" };
  return {
    title: `${prototype.bankName} · ${prototype.useCaseName} — Creditas Journey Builder`,
  };
}

export default async function PrototypePage({ params }: Props) {
  const { id } = await params;
  const prototype = readById(id);
  if (!prototype) notFound();
  return <PrototypeViewer prototype={prototype} />;
}
