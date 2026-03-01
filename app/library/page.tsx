import { Metadata } from "next";
import LibraryClient from "./LibraryClient";

export const metadata: Metadata = {
  title: "Prototype Library — Creditas Journey Builder",
};

export default function LibraryPage() {
  return <LibraryClient />;
}
