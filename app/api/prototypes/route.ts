import { NextRequest, NextResponse } from "next/server";
import { readAll, save } from "@/lib/db";
import { SavedPrototype } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const bank = searchParams.get("bank") ?? "";
  const useCase = searchParams.get("useCase") ?? "";

  let prototypes = readAll();

  if (search) {
    prototypes = prototypes.filter(
      (p) =>
        p.bankName.toLowerCase().includes(search) ||
        p.useCaseName.toLowerCase().includes(search) ||
        p.config.customerName.toLowerCase().includes(search)
    );
  }
  if (bank) prototypes = prototypes.filter((p) => p.bankId === bank);
  if (useCase) prototypes = prototypes.filter((p) => p.useCaseId === useCase);

  return NextResponse.json(prototypes);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<SavedPrototype, "id" | "createdAt">;
  const prototype: SavedPrototype = {
    ...body,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  save(prototype);
  return NextResponse.json(prototype, { status: 201 });
}
