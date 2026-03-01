import fs from "fs";
import path from "path";
import { SavedPrototype } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "prototypes.json");

function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

export function readAll(): SavedPrototype[] {
  try {
    ensureDbExists();
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as SavedPrototype[];
  } catch {
    return [];
  }
}

export function readById(id: string): SavedPrototype | null {
  const all = readAll();
  return all.find((p) => p.id === id) ?? null;
}

export function save(prototype: SavedPrototype): void {
  ensureDbExists();
  const all = readAll();
  const existing = all.findIndex((p) => p.id === prototype.id);
  if (existing >= 0) {
    all[existing] = prototype;
  } else {
    all.unshift(prototype); // newest first
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(all, null, 2));
}

export function deleteById(id: string): boolean {
  ensureDbExists();
  const all = readAll();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2));
  return true;
}
