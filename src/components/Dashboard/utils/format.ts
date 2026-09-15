import { moneyToNumber } from "@/utils/adapters";

/** "$1,200". Money viaja como string decimal; nunca Number(price) directo. */
export function formatMoney(amount: string | number | null | undefined): string {
  const value = typeof amount === "number" ? amount : moneyToNumber(amount);
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/** "08:30" en formato de 24 h, como la agenda del mostrador. */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

export function ownerName(owner: {
  name: string | null;
  lastname: string | null;
} | null | undefined): string {
  if (!owner) return "";
  return [owner.name, owner.lastname].filter(Boolean).join(" ");
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
