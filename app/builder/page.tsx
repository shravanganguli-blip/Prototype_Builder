import BuilderWizard from "@/components/builder/BuilderWizard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Prototype — Creditas Journey Builder",
};

export default function BuilderPage() {
  return <BuilderWizard />;
}
